const AppError = require("../../utils/AppError");
const { Disbursement, Project } = require("../../Database_Models/Models");
const { resolveCropRate, applyCropCredit } = require("../../utils/cropRecovery");

// Process physical crop deliveries to clear farmer Salam repayments
const submitCropRecovery = async (req, res, next) => {
  try {
    const { beneficiaryId, projectId, cropType, weight } = req.body;
    if (!beneficiaryId || !projectId || !cropType || !weight) {
      return next(new AppError("Farmer ID, Project ID, Crop Type, and Weight are required", 400));
    }

    // Tenant scoping: the project must belong to the calling cooperative.
    const project = await Project.findOne({
      _id: projectId,
      organizationId: req.organization._id,
    });
    if (!project) {
      return next(new AppError("Project not found for this cooperative", 404));
    }

    // Find active disbursement for the farmer & project
    const disbursement = await Disbursement.findOne({ beneficiaryId, projectId });
    if (!disbursement) {
      return next(new AppError("No active input disbursement schedule found for this farmer", 404));
    }

    const parsedWeight = parseFloat(weight);
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      return next(new AppError("Weight must be a positive number", 400));
    }

    // Crop valuation is configured per project by the cooperative (Salam
    // contract parameters), not hardcoded.
    const rate = resolveCropRate(project, cropType);
    const initialCredit = parsedWeight * rate;

    const { remainingCredit, clearedInstallmentsCount } = applyCropCredit(
      disbursement.repaymentSchedule,
      initialCredit
    );

    await disbursement.save();

    return res.status(200).json({
      status: "success",
      message: "Crop delivery logged successfully",
      data: {
        totalCreditGenerated: initialCredit,
        remainingCredit,
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
