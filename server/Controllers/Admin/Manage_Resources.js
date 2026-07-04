const { Project, Report } = require("../../Database_Models/Models");

//View all projects (Admin)
const viewProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("organizationId");

    const [activeProjects, suspendedProjects] = await Promise.all([
      Project.countDocuments({ status: "active" }),
      Project.countDocuments({ status: "suspended" }),
    ]);

    //Response Date
    const responseData = {
      projects: projects.length > 0 ? projects : [],
      counts: {
        activeProjects,
        suspendedProjects,
      },
    };

    //Response messages
    const messages = [];
    if (projects.length === 0) messages.push("No projects found");
    if (activeProjects === 0) messages.push("No active projects found");
    if (suspendedProjects === 0) messages.push("No suspended projects found");

    if (messages.length > 0) {
      responseData.messages = messages;
    }

    res.status(200).json({ responseData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Deactivate a project (Admin)
const deactivateProject = async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  try {
    const project = await Project.findOneAndUpdate(
      { _id: projectId },
      { status: "suspended" },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res
      .status(200)
      .json({ message: "Project deactivated successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Delete a project (Admin)
const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Create project report (Admin)
const createProjectReport = async (req, res) => {
  const {
    projectId,
    projectName,
    budgetAllocated,
    status,
    milestonesAchieved,
    milestonesPending,
    challengesFaced,
    stakeholderFeedback,
    fundsDisbursed,
    fundsUtilized,
    financialRemarks,
    createdBy,
  } = req.body;
  if (!projectId) {
    return res.status(400).json({ error: "Project ID required" });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const newReport = new Report({
      organizationId: project.organizationId,
      projectId: projectId,
      projectName,
      budgetAllocated,
      status,
      milestonesAchieved,
      milestonesPending,
      challengesFaced,
      stakeholderFeedback,
      fundsDisbursed,
      fundsUtilized,
      financialRemarks,
      createdBy,
    });

    await newReport.save();
    res.status(200).json({ message: "Report created successfully", newReport });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  viewProjects,
  deactivateProject,
  deleteProject,
  createProjectReport,
};
