const AppError = require("../../utils/AppError");
const { Voucher } = require("../../Database_Models/Models");

// Helper to generate a unique random voucher code format (e.g., VP-XXXX-XXXX)
const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `VP-${part1}-${part2}`;
};

// Generate a new seed/input voucher for a farmer
const generateVoucher = async (req, res, next) => {
  try {
    const { beneficiaryId, projectId, itemName, quantity } = req.body;
    if (!beneficiaryId || !projectId || !itemName) {
      return next(new AppError("Beneficiary ID, Project ID and Item Name are required", 400));
    }

    const code = generateCode();

    const voucher = await Voucher.create({
      code,
      beneficiaryId,
      projectId,
      itemDetails: {
        itemName,
        quantity: quantity || 1
      },
      status: "unused"
    });

    return res.status(201).json({
      status: "success",
      data: voucher
    });
  } catch (error) {
    return next(error);
  }
};

// Redeem a voucher by warehouse agents
const redeemVoucher = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return next(new AppError("Voucher verification code is required", 400));
    }

    const voucher = await Voucher.findOne({ code })
      .populate("beneficiaryId", "personalDetails")
      .populate("projectId", "name");

    if (!voucher) {
      return next(new AppError("Voucher verification failed: Code is invalid.", 404));
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
    voucher.redeemedBy = req.user.email || "Warehouse Agent";
    await voucher.save();

    return res.status(200).json({
      status: "success",
      message: "Voucher redeemed successfully",
      data: voucher
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
      data: vouchers
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateVoucher,
  redeemVoucher,
  getFarmerVouchers
};
