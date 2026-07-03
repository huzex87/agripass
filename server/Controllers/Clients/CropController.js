const AppError = require("../../utils/AppError");

// Process physical crop deliveries to clear farmer Salam repayments
const submitCropRecovery = async (req, res, next) => {
  try {
    const { beneficiaryId, projectId, cropType, weight } = req.body;
    if (!beneficiaryId || !projectId || !cropType || !weight) {
      return next(new AppError("Farmer ID, Project ID, Crop Type, and Weight are required", 400));
    }

    const Disbursement = req.getTenantModel("Disbursement");
    
    // Find active disbursement for the farmer & project
    const disbursement = await Disbursement.findOne({ beneficiaryId, projectId });
    if (!disbursement) {
      return next(new AppError("No active input disbursement schedule found for this farmer", 404));
    }

    // Standard pre-agreed crop valuation rates (Salam contract parameters)
    const valuationRates = {
      wheat: 450, // ₦450 per kg of wheat
      rice: 400,  // ₦400 per kg of rice
      maize: 350  // ₦350 per kg of maize
    };

    const rate = valuationRates[cropType.toLowerCase()] || 300; // Fallback rate ₦300
    let credit = parseFloat(weight) * rate;
    const initialCredit = credit;

    let clearedInstallmentsCount = 0;

    // Iterate through schedule to apply credit to pending/overdue Salam installments
    for (const inst of disbursement.repaymentSchedule) {
      if (inst.repaymentType === "Salam" && inst.status !== "paid") {
        if (credit >= inst.amount) {
          credit -= inst.amount;
          inst.status = "paid";
          inst.paidAt = new Date();
          clearedInstallmentsCount++;
        } else if (credit > 0) {
          // Partially pay the installment
          inst.amount -= credit;
          credit = 0;
        }
      }
      if (credit <= 0) break;
    }

    await disbursement.save();

    return res.status(200).json({
      status: "success",
      message: "Crop delivery logged successfully",
      data: {
        totalCreditGenerated: initialCredit,
        remainingCredit: credit,
        clearedInstallmentsCount,
        ratePerKg: rate
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  submitCropRecovery
};
