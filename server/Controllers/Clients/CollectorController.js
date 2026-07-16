const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  DataCollector,
  Beneficiary,
  Project,
  BeneficiaryApplication,
} = require("../../Database_Models/Models");
const { saveBeneficiaryWithUniqueId } = require("../../utils/saveBeneficiary");

// ---------------------------------------------------------------------------
// Is a farmer's location within a collector's assigned areas?
// A collector assigned at the LGA level can register anyone in that LGA; a
// state-level assignment covers the whole state; a ward-level one is exact.
// Exported for testing.
// ---------------------------------------------------------------------------
const eq = (a, b) => a && b && a.toLowerCase().trim() === b.toLowerCase().trim();

const isLocationAllowed = (assignedLocations, loc) => {
  if (!Array.isArray(assignedLocations) || assignedLocations.length === 0) return false;
  if (!loc) return false;
  return assignedLocations.some((area) => {
    if (area.ward) return eq(area.ward, loc.ward) && (!area.lga || eq(area.lga, loc.lga));
    if (area.lga) return eq(area.lga, loc.lga) && (!area.state || eq(area.state, loc.state));
    if (area.state) return eq(area.state, loc.state);
    return false;
  });
};

// ---------------------------------------------------------------------------
// Cooperative-admin management (organization role + subdomain context)
// ---------------------------------------------------------------------------
const createCollector = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, assignedLocations } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "First name, last name, email and password are required" });
    }

    const existing = await DataCollector.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "A collector with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const collector = await DataCollector.create({
      organizationId: req.organization._id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      assignedLocations: Array.isArray(assignedLocations) ? assignedLocations : [],
      status: "active",
    });

    const obj = collector.toObject();
    delete obj.password;
    res.status(201).json({ message: "Data collector created", collector: obj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getCollectors = async (req, res) => {
  try {
    const collectors = await DataCollector.find({ organizationId: req.organization._id })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, collectors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const setCollectorStatus = (targetStatus) => async (req, res) => {
  try {
    const { collectorId } = req.params;
    const collector = await DataCollector.findOneAndUpdate(
      { _id: collectorId, organizationId: req.organization._id },
      { status: targetStatus },
      { new: true, runValidators: true }
    ).select("-password");
    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }
    res.status(200).json({ message: `Collector ${targetStatus}`, collector });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ---------------------------------------------------------------------------
// Collector-side (public login + collector-role actions)
// ---------------------------------------------------------------------------
const loginCollector = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const collector = await DataCollector.findOne({ email });
    if (!collector) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, collector.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (collector.status !== "active") {
      return res.status(403).json({ error: "This collector account is not active." });
    }

    collector.lastLogin = new Date();
    await collector.save();

    const token = jwt.sign(
      { id: collector._id, organizationId: collector.organizationId, role: "collector" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      collectorName: `${collector.firstName} ${collector.lastName}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getCollectorDashboard = async (req, res) => {
  try {
    const collector = await DataCollector.findById(req.user.id).select("-password");
    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    const farmers = await Beneficiary.find({ registeredBy: collector._id })
      .select("personalDetails.firstName personalDetails.lastName personalDetails.phone location farmerIdNumber status createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      collector,
      stats: { registeredFarmers: farmers.length },
      farmers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Register a farmer on behalf of a low-literacy applicant, scoped to the
// collector's assigned locations.
const registerFarmerByCollector = async (req, res) => {
  try {
    const {
      firstName, lastName, gender, dateOfBirth, phone, email, password,
      idType, idNumber, state, lga, ward, pollingUnit,
    } = req.body;

    if (!firstName || !lastName || !gender || !phone || !email || !password || !idType || !idNumber || !state || !lga) {
      return res.status(400).json({ error: "All required farmer fields must be provided" });
    }

    const collector = await DataCollector.findById(req.user.id);
    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    const location = { state, lga, ward, pollingUnit };
    if (!isLocationAllowed(collector.assignedLocations, location)) {
      return res.status(403).json({
        error: "This farmer's location is outside your assigned coverage areas.",
      });
    }

    const dupId = await Beneficiary.findOne({ "identification.idNumber": idNumber });
    if (dupId) return res.status(400).json({ error: "A farmer with this ID number already exists" });
    const dupEmail = await Beneficiary.findOne({ "personalDetails.email": email });
    if (dupEmail) return res.status(400).json({ error: "This email is already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const beneficiary = new Beneficiary({
      personalDetails: {
        firstName, lastName, gender, dateOfBirth, phone, email, password: hashedPassword,
      },
      identification: { idType, idNumber },
      status: "pending",
      location,
      registeredBy: collector._id,
      organizationId: collector.organizationId,
    });
    await saveBeneficiaryWithUniqueId(beneficiary);

    res.status(201).json({
      message: "Farmer registered successfully",
      farmerId: beneficiary._id,
      farmerIdNumber: beneficiary.farmerIdNumber,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Apply to a project on behalf of a farmer the collector registered.
const applyForFarmer = async (req, res) => {
  try {
    const { beneficiaryId, projectId } = req.body;
    if (!beneficiaryId || !projectId) {
      return res.status(400).json({ error: "Farmer and project are required" });
    }

    const farmer = await Beneficiary.findOne({ _id: beneficiaryId, registeredBy: req.user.id });
    if (!farmer) {
      return res.status(403).json({ error: "You can only apply for farmers you registered." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const existing = await BeneficiaryApplication.findOne({ beneficiaryId, projectId });
    if (existing) {
      return res.status(400).json({ error: "This farmer has already applied to this project." });
    }

    const application = await BeneficiaryApplication.create({
      beneficiaryId,
      projectId,
      organizationId: project.organizationId,
      status: "pending",
    });

    res.status(201).json({ success: true, message: "Application submitted", application });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Projects available for the collector's organization (to apply on behalf).
const getCollectorProjects = async (req, res) => {
  try {
    const collector = await DataCollector.findById(req.user.id);
    if (!collector) return res.status(404).json({ error: "Collector not found" });
    const projects = await Project.find({
      organizationId: collector.organizationId,
      status: "active",
    }).select("name type");
    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createCollector,
  getCollectors,
  suspendCollector: setCollectorStatus("suspended"),
  activateCollector: setCollectorStatus("active"),
  loginCollector,
  getCollectorDashboard,
  registerFarmerByCollector,
  applyForFarmer,
  getCollectorProjects,
  // exported for tests
  isLocationAllowed,
};
