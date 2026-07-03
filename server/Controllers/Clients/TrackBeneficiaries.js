const {
  Disbursement,
  BeneficiaryApplication,
  Project,
} = require("../../Database_Models/Models");

const recentBeneficaryApplications = async (req, res) => {
  const { _id } = req.organization;
  if (!_id) throw new Error("Unauthorized Access.");

  try {
    const recentApplication = await BeneficiaryApplication.find({
      organizationId: _id,
      status: "pending",
    })
      .populate("beneficiaryId")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    if (!recentApplication || recentApplication.length === 0) {
      return res.status(200).json({ error: "No recent applications found" });
    }

    res.status(200).json(recentApplication);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { recentBeneficaryApplications };
