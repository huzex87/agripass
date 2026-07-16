const AppError = require("../../utils/AppError");
const {
  Voucher,
  Project,
  BeneficiaryApplication,
  Disbursement,
  Beneficiary,
} = require("../../Database_Models/Models");
const { notify } = require("../../utils/sms");

// Helper to generate a unique random voucher code format (e.g., VP-XXXX-XXXX)
const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `VP-${part1}-${part2}`;
};

// Create a voucher with a collision-safe unique code. The `code` field is
// uniquely indexed, so on the rare duplicate we retry rather than 500.
const createVoucherWithUniqueCode = async (fields, attempts = 5) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await Voucher.create({ ...fields, code: generateCode() });
    } catch (err) {
      if (err.code === 11000 && i < attempts - 1) continue; // duplicate code, retry
      throw err;
    }
  }
};

// Generate a new seed/input voucher for a farmer
const generateVoucher = async (req, res, next) => {
  try {
    const { beneficiaryId, projectId, itemName, quantity } = req.body;
    if (!beneficiaryId || !projectId || !itemName) {
      return next(new AppError("Beneficiary ID, Project ID and Item Name are required", 400));
    }

    // Tenant scoping: the project must belong to the calling cooperative.
    const project = await Project.findOne({
      _id: projectId,
      organizationId: req.organization._id,
    });
    if (!project) {
      return next(new AppError("Project not found for this cooperative", 404));
    }

    // The farmer must have an approved application to this project before a
    // voucher can be issued — prevents issuing inputs to unenrolled farmers.
    const approved = await BeneficiaryApplication.findOne({
      beneficiaryId,
      projectId,
      status: "approved",
    });
    if (!approved) {
      return next(new AppError("This farmer has no approved application for this project", 400));
    }

    // Link the voucher to the farmer's financing disbursement when one exists,
    // so redemption and repayment share a single ledger.
    const disbursement = await Disbursement.findOne({ beneficiaryId, projectId }).select("_id");

    const voucher = await createVoucherWithUniqueCode({
      beneficiaryId,
      projectId,
      disbursementId: disbursement?._id || null,
      itemDetails: {
        itemName,
        quantity: quantity || 1,
      },
      status: "unused",
    });

    // Text the farmer their voucher code (no-op if SMS isn't configured).
    const farmer = await Beneficiary.findById(beneficiaryId).select("personalDetails.phone personalDetails.firstName");
    if (farmer?.personalDetails?.phone) {
      notify(
        farmer.personalDetails.phone,
        `AgriPass: Your input voucher for "${itemName}" is ${voucher.code}. Present this code at your redemption center.`
      );
    }

    return res.status(201).json({
      status: "success",
      data: voucher,
    });
  } catch (error) {
    return next(error);
  }
};

// Redeem a voucher (cooperative-side path)
const redeemVoucher = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return next(new AppError("Voucher verification code is required", 400));
    }

    const voucher = await Voucher.findOne({ code })
      .populate("beneficiaryId", "personalDetails")
      .populate("projectId", "name organizationId");

    if (!voucher) {
      return next(new AppError("Voucher verification failed: Code is invalid.", 404));
    }

    // Tenant scoping: a cooperative can only redeem vouchers from its own
    // projects.
    if (
      !voucher.projectId ||
      voucher.projectId.organizationId?.toString() !== req.organization._id.toString()
    ) {
      return next(new AppError("This voucher does not belong to your cooperative", 403));
    }

    if (voucher.status === "redeemed") {
      return next(new AppError(`Voucher has already been redeemed on ${new Date(voucher.redeemedAt).toLocaleString()}`, 400));
    }

    if (voucher.status === "expired") {
      return next(new AppError("Voucher has expired and cannot be processed", 400));
    }

    // Process redemption
    voucher.status = "redeemed";
    voucher.redeemedAt = new Date();
    voucher.redeemedBy = req.user.email || "Cooperative Staff";
    await voucher.save();

    return res.status(200).json({
      status: "success",
      message: "Voucher redeemed successfully",
      data: voucher,
    });
  } catch (error) {
    return next(error);
  }
};

// Get all active vouchers for a logged-in farmer
const getFarmerVouchers = async (req, res, next) => {
  try {
    const vouchers = await Voucher.find({ beneficiaryId: req.user.id })
      .populate("projectId", "name description imageURL");

    return res.status(200).json({
      status: "success",
      data: vouchers,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateVoucher,
  redeemVoucher,
  getFarmerVouchers,
  // exported for tests
  generateCode,
};
