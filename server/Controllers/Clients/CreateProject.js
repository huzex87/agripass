const { Project } = require("../../Database_Models/Models");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const AppError = require("../../utils/AppError");

// Normalizes a salamCropRates input (array or JSON string from multipart) into
// a clean list of { crop, ratePerKg } with valid, positive rates.
const parseCropRates = (input) => {
  if (!input) return [];
  let arr = input;
  if (typeof input === "string") {
    try {
      arr = JSON.parse(input);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .map((r) => ({ crop: String(r.crop || "").trim(), ratePerKg: Number(r.ratePerKg) }))
    .filter((r) => r.crop && Number.isFinite(r.ratePerKg) && r.ratePerKg > 0);
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(file.mimetype);
    if (!extname || !file.mimetype.startsWith("image/")) {
      return cb(new AppError("File type not supported. Only image files are allowed", 400));
    }
    cb(null, true);
  },
});

const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      amount,
      startDate,
      endDate,
      hasCustomForm,
      salamCropRates,
      defaultCropRate,
    } = req.body;
    if (!name || !description || !type || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // salamCropRates may arrive as a JSON string (multipart form). Parse and
    // keep only well-formed { crop, ratePerKg } entries.
    const parsedCropRates = parseCropRates(salamCropRates);

    let imageURL = null;
    let imagePublicId = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        { folder: `projects/${req.organization.id}` }
      );

      imageURL = result.secure_url;
      imagePublicId = result.public_id;
    }

    const project = new Project({
      organizationId: req.organization.id,
      name,
      description,
      type,
      budget:
        amount !== undefined && amount !== null
          ? { amount: amount, currency: "NGN" }
          : undefined,
      startDate,
      endDate,
      status: "active",
      imageURL,
      imagePublicId,
      salamCropRates: parsedCropRates,
      defaultCropRate:
        defaultCropRate !== undefined && defaultCropRate !== null && defaultCropRate !== ""
          ? Number(defaultCropRate)
          : undefined,
      hasCustomForm: hasCustomForm === "true", // Convert string to boolean
      customForm:
        hasCustomForm === "true"
          ? {
              fields: [],
              title: "Application Form",
              description:
                "Please fill out this form to apply for this project.",
              isActive: false, // Will be activated after form is built
            }
          : undefined,
    });
    await project.save();
    res.status(200).json({
      message: "Project created successfully",
      project,
      projectId: project._id, // Add projectId for frontend redirect
      hasCustomForm: project.hasCustomForm,
      imageURL,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update a project's core details (name/description/type/budget/dates/image)
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      name,
      description,
      type,
      amount,
      startDate,
      endDate,
      salamCropRates,
      defaultCropRate,
    } = req.body;
    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const project = await Project.findOne({
      _id: projectId,
      organizationId: req.organization._id,
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (type !== undefined) project.type = type;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (amount !== undefined && amount !== null && amount !== "") {
      project.budget = { amount, currency: project.budget?.currency || "NGN" };
    }
    if (salamCropRates !== undefined) {
      project.salamCropRates = parseCropRates(salamCropRates);
    }
    if (defaultCropRate !== undefined && defaultCropRate !== null && defaultCropRate !== "") {
      project.defaultCropRate = Number(defaultCropRate);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: `projects/${req.organization.id}` }
      );
      project.imageURL = result.secure_url;
      project.imagePublicId = result.public_id;
    }

    await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const updateForm = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, fields, isActive } = req.body;

    // Validate fields
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: "At least one field is required" });
    }

    // Validate each field
    for (const field of fields) {
      if (!field.label || !field.type) {
        return res
          .status(400)
          .json({ error: "Each field must have a label and type" });
      }

      // Validate options for select/radio/checkbox
      if (["select", "radio", "checkbox"].includes(field.type)) {
        if (!field.options || field.options.length === 0) {
          return res.status(400).json({
            error: `${field.type} fields must have at least one option`,
          });
        }
      }
    }

    // Find and update project
    const project = await Project.findOne({
      _id: projectId,
      organizationId: req.organization.id,
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (!project.hasCustomForm) {
      return res
        .status(400)
        .json({ error: "This project doesn't have custom form enabled" });
    }

    // Update the custom form
    project.customForm = {
      title: title || "Application Form",
      description:
        description || "Please fill out this form to apply for this project.",
      fields: fields.map((field, index) => ({
        ...field,
        order: index, // Ensure correct order
      })),
      isActive: isActive !== undefined ? isActive : true,
    };

    await project.save();

    res.status(200).json({
      message: "Custom form updated successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET ACTIVE PROJECTS
const getActiveProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const { _id } = req.organization;
    if (!_id) {
      throw new Error("Ünauthorized Access");
    }

    const filter = { organizationId: _id };
    if (status) {
      filter.status = status;
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      projects,
      currentPage: Number(page),
      totalPage: Math.ceil(total / limit),
      total: Number(total),
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET ACTIVE PROJECTS ACROSS ALL ORGANIZATIONS (farmer marketplace browsing)
// Beneficiaries are global accounts not tied to a single cooperative's
// subdomain, so this deliberately skips the organizationId scoping used by
// getActiveProjects (the organization-dashboard equivalent).
const getPublicActiveProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const filter = { status: "active" };

    const activeProjects = await Project.find(filter)
      .populate("organizationId", "name subdomain")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      activeProjects,
      currentPage: Number(page),
      totalPage: Math.ceil(total / limit),
      total: Number(total),
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET A SINGLE PROJECT'S DETAILS FOR FARMER BROWSING (no subdomain context)
const getPublicProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const project = await Project.findById(projectId).populate("organizationId", "name subdomain");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Deactivate project
const markAsCompleted = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    const existingProject = await Project.findOne({
      _id: projectId,
      organizationId: req.organization._id,
    });
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (existingProject.status === "completed") {
      return res.status(400).json({ error: "Project is already completed" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, organizationId: req.organization._id },
      { status: "completed" },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Project completed successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const activateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    const existingProject = await Project.findOne({
      _id: projectId,
      organizationId: req.organization._id,
    });
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (existingProject.status === "active") {
      return res.status(400).json({ error: "Project is already active" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, organizationId: req.organization._id },
      { status: "active" },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Project activated successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Suspend Project
const suspendProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }
    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const existingProject = await Project.findOne({
      _id: projectId,
      organizationId: req.organization._id,
    });
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (existingProject.status === "suspended") {
      return res.status(400).json({ error: "Project is already suspended" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, organizationId: req.organization._id },
      { status: "suspended" },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Project suspended successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Delete project
const deleteResource = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }
    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const project = await Project.findOneAndDelete({
      _id: projectId,
      organizationId: req.organization._id,
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ENDPOINT TO GET SPECIFIC PROJECT DETAILS
const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }
    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const project = await Project.findOne({
      _id: projectId,
      organizationId: req.organization._id,
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createProject,
  getActiveProjects,
  getPublicActiveProjects,
  getPublicProjectDetails,
  markAsCompleted,
  deleteResource,
  getProjectDetails,
  suspendProject,
  activateProject,
  updateForm,
  updateProject,
  upload,
  // exported for tests
  parseCropRates,
};
