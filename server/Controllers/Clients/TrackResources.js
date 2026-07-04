const mongoose = require("mongoose");
const { Project, Disbursement } = require("../../Database_Models/Models");

const trackResources = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);

  const { id } = req.user;
  if (!id) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const aggregationResult = await Project.aggregate([
      { $match: { organizationId: new mongoose.Types.ObjectId(id) } },
      {
        $facet: {
          activeProjects: [
            { $match: { status: "active" } },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          completedProjects: [
            { $match: { status: "completed" } },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          draftProjects: [
            { $match: { status: "draft" } },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          totalCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const result = aggregationResult[0];
    const totalCounts = result.totalCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const responseData = {
      activeProjects: result.activeProjects,
      completedProjects: result.completedProjects,
      draftProjects: result.draftProjects,
      totalActive: totalCounts["active"] || 0,
      totalCompleted: totalCounts["completed"] || 0,
      totalDraft: totalCounts["draft"] || 0,
      totalPageActive: Math.ceil((totalCounts["active"] || 0) / limit),
      totalPageCompleted: Math.ceil((totalCounts["completed"] || 0) / limit),
      totalPageDraft: Math.ceil((totalCounts["draft"] || 0) / limit),
      currentPage: page,
    };

    res.status(200).json({ success: true, responseData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// This function tracks the disbursement status of resources
const trackDisbursement = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);

  const { id } = req.user;
  if (!id) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const orgProjects = await Project.find({
      organizationId: new mongoose.Types.ObjectId(id),
    }).select("_id");
    const projectIds = orgProjects.map((p) => p._id);

    const disbursementData = await Disbursement.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      {
        $facet: {
          pendingDisbursement: [
            { $match: { status: "pending" } },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          approvedDisbursement: [
            { $match: { status: "approved" } },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          completedDisbursement: [
            { $match: { status: "disbursed" } },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          totalCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const result = disbursementData[0];
    const totalCounts = result.totalCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const responseData = {
      pendingDisbursement: result.pendingDisbursement,
      approvedDisbursement: result.approvedDisbursement,
      completedDisbursement: result.completedDisbursement,
      totalPending: totalCounts["pending"] || 0,
      totalApproved: totalCounts["approved"] || 0,
      totalCompleted: totalCounts["disbursed"] || 0,
      totalPagePending: Math.ceil((totalCounts["pending"] || 0) / limit),
      totalPageApproved: Math.ceil((totalCounts["approved"] || 0) / limit),
      totalPageCompleted: Math.ceil((totalCounts["disbursed"] || 0) / limit),
      currentPage: page,
    };
    res.status(200).json({ success: true, responseData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { trackResources, trackDisbursement };
