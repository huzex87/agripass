const AppError = require("../../utils/AppError");
const { Disbursement, Wallet, Transaction, Project, Beneficiary } = require("../../Database_Models/Models");

// Retrieve repayments for the authenticated farmer beneficiary
const getFarmerRepayments = async (req, res, next) => {
  try {
    // Find all disbursements with active schedules for this farmer
    const repayments = await Disbursement.find({
      beneficiaryId: req.user.id
    }).populate("projectId", "name description budget");

    return res.status(200).json({
      status: "success",
      data: repayments
    });
  } catch (error) {
    return next(error);
  }
};

// Process an installment payment from farmer's wallet
const submitRepayment = async (req, res, next) => {
  try {
    const { disbursementId, installmentId } = req.body;
    if (!disbursementId || !installmentId) {
      return next(new AppError("Disbursement ID and Installment ID are required", 400));
    }

    // Retrieve active disbursement for farmer
    const disbursement = await Disbursement.findOne({
      _id: disbursementId,
      beneficiaryId: req.user.id
    });

    if (!disbursement) {
      return next(new AppError("Active disbursement schedule not found", 404));
    }

    // Locate the specific installment in subdocuments array
    const installment = disbursement.repaymentSchedule.id(installmentId);
    if (!installment) {
      return next(new AppError("Specified installment schedule not found", 404));
    }

    if (installment.status === "paid") {
      return next(new AppError("This installment has already been paid", 400));
    }

    // Atomic, guarded debit: only succeeds if the balance still covers the
    // installment at write time, so two concurrent repayments can never
    // overdraw the wallet (the read-then-write pattern could double-spend).
    const wallet = await Wallet.findOneAndUpdate(
      { beneficiaryId: req.user.id, balance: { $gte: installment.amount } },
      { $inc: { balance: -installment.amount } },
      { new: true }
    );
    if (!wallet) {
      const exists = await Wallet.exists({ beneficiaryId: req.user.id });
      return next(
        new AppError(
          exists
            ? "Insufficient wallet balance to perform this repayment"
            : "Farmer wallet not found",
          exists ? 400 : 404
        )
      );
    }

    installment.status = "paid";
    installment.paidAmount = installment.amount;
    installment.paidAt = new Date();
    try {
      await disbursement.save();
    } catch (saveErr) {
      // Roll the debit back if we couldn't record the installment as paid.
      await Wallet.updateOne(
        { _id: wallet._id },
        { $inc: { balance: installment.amount } }
      );
      throw saveErr;
    }

    // Log the transaction
    const transaction = await Transaction.create({
      walletId: wallet._id,
      disbursementId: disbursement._id,
      type: "debit",
      amount: installment.amount,
      currency: disbursement.currency || "NGN",
      status: "completed",
      metadata: {
        description: `AgriPass Input Repayment (${installment.repaymentType})`,
        reference: `REPAY_${disbursement._id.toString().substring(18)}_${Date.now().toString().substring(8)}`
      }
    });

    return res.status(200).json({
      status: "success",
      message: "Repayment processed successfully",
      data: {
        newBalance: wallet.balance,
        transaction
      }
    });
  } catch (error) {
    return next(error);
  }
};

// Retrieve aggregated repayment statistics for organization dashboard
const getOrganizationRepayments = async (req, res, next) => {
  try {
    // Resolve projects matching organization
    const projects = await Project.find({ organizationId: req.user.id });
    const projectIds = projects.map((p) => p._id);

    // Retrieve all disbursements for projects
    const disbursements = await Disbursement.find({
      projectId: { $in: projectIds }
    }).populate("beneficiaryId", "personalDetails location");

    let totalScheduled = 0;
    let totalPaid = 0;
    let totalOverdue = 0;
    const repaymentList = [];

    disbursements.forEach((d) => {
      d.repaymentSchedule.forEach((inst) => {
        totalScheduled += inst.amount;
        if (inst.status === "paid") {
          totalPaid += inst.amount;
        } else if (inst.status === "overdue" || (inst.status === "pending" && new Date() > new Date(inst.dueDate))) {
          totalOverdue += inst.amount;
        }

        repaymentList.push({
          disbursementId: d._id,
          farmer: d.beneficiaryId
            ? `${d.beneficiaryId.personalDetails.firstName} ${d.beneficiaryId.personalDetails.lastName}`
            : "Unknown Farmer",
          amount: inst.amount,
          dueDate: inst.dueDate,
          status: inst.status,
          repaymentType: inst.repaymentType,
          paidAt: inst.paidAt
        });
      });
    });

    return res.status(200).json({
      status: "success",
      data: {
        summary: {
          totalScheduled,
          totalPaid,
          totalOverdue,
          recoveryRate: totalScheduled > 0 ? ((totalPaid / totalScheduled) * 100).toFixed(1) + "%" : "0.0%"
        },
        repayments: repaymentList
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getFarmerWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ beneficiaryId: req.user.id });
    if (!wallet) {
      const newWallet = await Wallet.create({
        beneficiaryId: req.user.id,
        balance: 0,
        currency: "NGN",
        status: "active"
      });
      return res.status(200).json({ status: "success", data: newWallet });
    }
    return res.status(200).json({ status: "success", data: wallet });
  } catch (error) {
    return next(error);
  }
};

const getFarmerProfile = async (req, res, next) => {
  try {
    const farmer = await Beneficiary.findById(req.user.id).select("-personalDetails.password");
    if (!farmer) {
      return next(new AppError("Farmer profile not found", 404));
    }
    return res.status(200).json({ status: "success", data: farmer });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFarmerRepayments,
  submitRepayment,
  getOrganizationRepayments,
  getFarmerWallet,
  getFarmerProfile
};
