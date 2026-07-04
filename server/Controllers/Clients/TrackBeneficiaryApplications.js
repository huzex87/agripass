const {
  BeneficiaryApplication,
  Beneficiary,
} = require("../../Database_Models/Models");

//Approved application disbursement
const approvedApplicationDisbursement = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const applications = await BeneficiaryApplication.find({
      status: "approved",
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const totalApplications = await BeneficiaryApplication.countDocuments({
      status: "approved",
    });
    res.status(200).json({
      success: true,
      applications: applications.length > 0 ? applications : [],
      totalApplications,
      totalPages: Math.ceil(totalApplications / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Pending applications
// This function tracks the pending applications
const pendngApplications = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const applications = await BeneficiaryApplication.find({
      status: "pending",
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const totalApplications = await BeneficiaryApplication.countDocuments({
      status: "pending",
    });
    res.status(200).json({
      success: true,
      applications: applications.length > 0 ? applications : [],
      totalApplications,
      totalPages: Math.ceil(totalApplications / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Rejected applications
// This function tracks the rejected applications
const rejectedApplications = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const applications = await BeneficiaryApplication.find({
      status: "rejected",
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const totalApplications = await BeneficiaryApplication.countDocuments({
      status: "rejected",
    });
    res.status(200).json({
      success: true,
      applications: applications.length > 0 ? applications : [],
      totalApplications,
      totalPages: Math.ceil(totalApplications / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, searchTerm } = req.query;
    const validStatuses = ["pending", "approved", "rejected"];

    const { _id } = req.organization;
    if (!_id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access. Organization ID missing.",
      });
    }

    let filter = { organizationId: _id };

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid Status" });
    }

    if (status) {
      filter.status = status;
    }

    if (searchTerm) {
      const matchingBeneficiaries = await Beneficiary.find({
        $or: [
          {
            "personalDetails.firstName": { $regex: searchTerm, $options: "i" },
          },
          {
            "personalDetails.lastName": { $regex: searchTerm, $options: "i" },
          },
          {
            "personalDetails.email": { $regex: searchTerm, $options: "i" },
          },
        ],
      }).select("_id");

      const beneficiaryIds = matchingBeneficiaries.map((b) => b._id);
      if (beneficiaryIds.length === 0) {
        return res.status(200).json({
          success: true,
          applications: [],
          currentPage: Number(page),
          totalPage: 0,
          total: 0,
        });
      }
      filter.beneficiaryId = { $in: beneficiaryIds };
    }

    const applications = await BeneficiaryApplication.find(filter)
      .populate([{ path: "beneficiaryId" }, { path: "projectId" }])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await BeneficiaryApplication.countDocuments(filter);
    res.status(200).json({
      success: true,
      applications,
      currentPage: Number(page),
      totalPage: Math.ceil(total / limit),
      total: Number(total),
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
module.exports = {
  approvedApplicationDisbursement,
  pendngApplications,
  rejectedApplications,
  getAllApplications,
};
