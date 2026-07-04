const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  RedemptionCenter,
  Beneficiary,
  Voucher,
  BeneficiaryApplication,
} = require("../../Database_Models/Models");

// ---------------------------------------------------------------------------
// Location matching: pick the most specific center whose coverage matches a
// farmer's registered location (ward > lga > state). Exported for testing.
// ---------------------------------------------------------------------------
const eq = (a, b) => a && b && a.toLowerCase().trim() === b.toLowerCase().trim();

const coverageScore = (area, loc) => {
  // Ward-level coverage: ward must match (and lga, if the area names one).
  if (area.ward && eq(area.ward, loc.ward)) {
    if (area.lga && loc.lga && !eq(area.lga, loc.lga)) return -1;
    return 3;
  }
  // LGA-level coverage: area names an lga but no ward.
  if (area.lga && !area.ward && eq(area.lga, loc.lga)) {
    if (area.state && loc.state && !eq(area.state, loc.state)) return -1;
    return 2;
  }
  // State-level coverage: area names only a state.
  if (area.state && !area.lga && !area.ward && eq(area.state, loc.state)) {
    return 1;
  }
  return -1;
};

const findCenterForLocation = (centers, loc) => {
  if (!loc) return null;
  let best = null;
  let bestScore = 0;
  for (const center of centers) {
    for (const area of center.coverage || []) {
      const score = coverageScore(area, loc);
      if (score > bestScore) {
        bestScore = score;
        best = center;
      }
    }
  }
  return best;
};

const generateCenterCode = () =>
  `RC-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

// ---------------------------------------------------------------------------
// Cooperative-admin endpoints (require organization role + subdomain context)
// ---------------------------------------------------------------------------
const createCenter = async (req, res) => {
  try {
    const { name, email, password, contactPhone, coverage } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const existing = await RedemptionCenter.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "A center with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const center = await RedemptionCenter.create({
      organizationId: req.organization._id,
      name,
      code: generateCenterCode(),
      email,
      password: hashedPassword,
      contactPhone,
      coverage: Array.isArray(coverage) ? coverage : [],
      status: "active",
    });

    const centerObj = center.toObject();
    delete centerObj.password;
    res.status(201).json({ message: "Redemption center created", center: centerObj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getCenters = async (req, res) => {
  try {
    const centers = await RedemptionCenter.find({
      organizationId: req.organization._id,
    })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, centers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const setCenterStatus = (targetStatus) => async (req, res) => {
  try {
    const { centerId } = req.params;
    const center = await RedemptionCenter.findOneAndUpdate(
      { _id: centerId, organizationId: req.organization._id },
      { status: targetStatus },
      { new: true, runValidators: true }
    ).select("-password");
    if (!center) {
      return res.status(404).json({ error: "Center not found" });
    }
    res.status(200).json({ message: `Center ${targetStatus}`, center });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Auto-assign farmers (who applied to this organization's projects) to the
// center whose coverage matches their location.
const assignFarmersToCenters = async (req, res) => {
  try {
    const orgId = req.organization._id;
    const centers = await RedemptionCenter.find({ organizationId: orgId, status: "active" });
    if (centers.length === 0) {
      return res.status(400).json({ error: "No active centers to assign farmers to" });
    }

    const applications = await BeneficiaryApplication.find({ organizationId: orgId }).select(
      "beneficiaryId"
    );
    const beneficiaryIds = [...new Set(applications.map((a) => a.beneficiaryId.toString()))];
    const farmers = await Beneficiary.find({ _id: { $in: beneficiaryIds } });

    let assigned = 0;
    for (const farmer of farmers) {
      const center = findCenterForLocation(centers, farmer.location || {});
      if (center) {
        farmer.redemptionCenterId = center._id;
        await farmer.save();
        assigned++;
      }
    }

    res.status(200).json({
      message: `Assigned ${assigned} of ${farmers.length} farmers to centers`,
      assigned,
      total: farmers.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ---------------------------------------------------------------------------
// Center-side endpoints (public login + center-role dashboard)
// ---------------------------------------------------------------------------
const loginCenter = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const center = await RedemptionCenter.findOne({ email });
    if (!center) {
      return res.status(400).json({ error: "No center found with this email" });
    }

    const isMatch = await bcrypt.compare(password, center.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (center.status !== "active") {
      return res.status(403).json({ error: "This center is not active. Contact your cooperative." });
    }

    const token = jwt.sign(
      { id: center._id, organizationId: center.organizationId, role: "center" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      centerName: center.name,
      centerCode: center.code,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getCenterDashboard = async (req, res) => {
  try {
    const centerId = req.user.id;
    const center = await RedemptionCenter.findById(centerId).select("-password");
    if (!center) {
      return res.status(404).json({ error: "Center not found" });
    }

    const farmers = await Beneficiary.find({ redemptionCenterId: centerId }).select(
      "personalDetails.firstName personalDetails.lastName personalDetails.phone location farmerIdNumber status"
    );
    const redeemedCount = await Voucher.countDocuments({
      redeemedBy: center.code,
      status: "redeemed",
    });

    res.status(200).json({
      success: true,
      center,
      stats: {
        assignedFarmers: farmers.length,
        redeemedVouchers: redeemedCount,
      },
      farmers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// A center redeems an input voucher presented by a farmer.
const redeemVoucherAtCenter = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Voucher code is required" });
    }

    const center = await RedemptionCenter.findById(req.user.id);
    if (!center) {
      return res.status(404).json({ error: "Center not found" });
    }

    const voucher = await Voucher.findOne({ code })
      .populate("beneficiaryId", "personalDetails redemptionCenterId")
      .populate("projectId", "name");
    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }
    if (voucher.status === "redeemed") {
      return res.status(400).json({ error: "Voucher has already been redeemed" });
    }
    if (voucher.status === "expired") {
      return res.status(400).json({ error: "Voucher has expired" });
    }

    voucher.status = "redeemed";
    voucher.redeemedAt = new Date();
    voucher.redeemedBy = center.code;
    await voucher.save();

    res.status(200).json({ message: "Voucher redeemed successfully", voucher });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createCenter,
  getCenters,
  suspendCenter: setCenterStatus("suspended"),
  activateCenter: setCenterStatus("active"),
  assignFarmersToCenters,
  loginCenter,
  getCenterDashboard,
  redeemVoucherAtCenter,
  // exported for tests
  findCenterForLocation,
  coverageScore,
};
