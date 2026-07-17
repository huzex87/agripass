const {
  BeneficiaryApplication,
  Project,
  Disbursement,
  Beneficiary,
} = require("../../Database_Models/Models");
const { generateUniqueToken } = require("../Utils/tokenUtils");
const { notify } = require("../../utils/sms");

//Beneficiary's applly for a project/resources
const submitApplication = async (req, res) => {
  const projectId = req.body.projectId || req.params.projectId;
  const beneficiaryId = req.user.id;

  if (!beneficiaryId || !projectId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let isProjectExist = await Project.findOne({
      _id: projectId,
    });
    if (!isProjectExist) {
      return res.status(400).json({ error: "Project not found" });
    }

    const existingApplication = await BeneficiaryApplication.findOne({
      beneficiaryId,
      projectId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ error: "You have already applied for this project." });
    }

    const organzationId = isProjectExist.organizationId;

    // Build custom form responses
    let customFormResponses = [];
    if (isProjectExist.hasCustomForm && isProjectExist.customForm && isProjectExist.customForm.fields) {
      for (const field of isProjectExist.customForm.fields) {
        const val = req.body[field.id];
        if (field.required && (val === undefined || val === null || val === "")) {
          return res.status(400).json({ error: `Field '${field.label}' is required` });
        }
        customFormResponses.push({
          fieldId: field.id,
          type: field.type,
          label: field.label,
          value: val
        });
      }
    }

    const newApplication = new BeneficiaryApplication({
      beneficiaryId,
      projectId,
      organizationId: organzationId,
      status: "pending",
      customFormResponses,
    });
    await newApplication.save();

    // Update beneficiary profile if boundary or biometrics are supplied in custom form responses
    let beneficiaryUpdate = {};
    let plotsToPush = [];
    
    if (customFormResponses.length > 0) {
      for (const resp of customFormResponses) {
        if (resp.type === "biometrics" && resp.value) {
          if (resp.value.profilePhoto) {
            beneficiaryUpdate["personalDetails.profilePhoto"] = resp.value.profilePhoto;
          }
          if (resp.value.fingerprintHash) {
            beneficiaryUpdate["personalDetails.fingerprintHash"] = resp.value.fingerprintHash;
          }
        }
        if (["boundary", "plots", "farmPlot"].includes(resp.type) && resp.value) {
          if (resp.value.coordinates) {
            plotsToPush.push({
              polygon: {
                type: "Polygon",
                coordinates: resp.value.coordinates
              },
              hectarage: resp.value.hectarage || 0.5,
              tenureStatus: "owned"
            });
          }
        }
      }
    }
    
    if (Object.keys(beneficiaryUpdate).length > 0 || plotsToPush.length > 0) {
      const updateQuery = {};
      if (Object.keys(beneficiaryUpdate).length > 0) {
        updateQuery.$set = beneficiaryUpdate;
      }
      if (plotsToPush.length > 0) {
        updateQuery.$push = { "agriculturalProfile.plots": { $each: plotsToPush } };
      }
      
      await Beneficiary.findByIdAndUpdate(beneficiaryId, updateQuery);
    }

    res.status(200).json({
      success: true,
      message: "Beneficiary application submitted successfully",
      newApplication,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Beneficiary's application approval & pending disbursement
const approve_Beneficiary_Application = async (req, res) => {
  try {
    const { application_Id } = req.params;
    if (!application_Id) {
      return res.status(400).json({ error: "Application ID is required" });
    }
    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const application = await BeneficiaryApplication.findOne({
      _id: application_Id,
      organizationId: req.organization._id,
    });
    if (!application) {
      return res
        .status(400)
        .json({ error: "Beneficiary application not found" });
    }

    // Check if application is already approved
    if (application.status === "approved") {
      return res
        .status(400)
        .json({ error: "Beneficiary application already approved" });
    }

    const newApplicationStatus = await BeneficiaryApplication.findOneAndUpdate(
      { _id: application_Id, organizationId: req.organization._id },
      { status: "approved" },
      { new: true }
    );

    const newDisbursement = new Disbursement({
      projectId: application.projectId,
      beneficiaryId: application.beneficiaryId,
      status: "pending",
    });
    await newDisbursement.save();

    // Notify the farmer their application was approved (no-op without SMS).
    const [farmer, project] = await Promise.all([
      Beneficiary.findById(application.beneficiaryId).select("personalDetails.phone"),
      Project.findById(application.projectId).select("name"),
    ]);
    if (farmer?.personalDetails?.phone) {
      notify(
        farmer.personalDetails.phone,
        `AgriPass: Good news! Your application${project?.name ? ` for "${project.name}"` : ""} has been approved. Your input voucher will follow shortly.`
      );
    }

    res.status(200).json({
      message: "Beneficiary application approved successfully",
      newApplicationStatus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//GENERATE A UNIQUE TOKEN FOR EACH APPROVED APPLICATION(SINGLE TOKEN GENERATION)
const generateVerificationToken = async (req, res) => {
  try {
    const { beneficiary_id } = req.params;
    if (!beneficiary_id) {
      return res.status(400).json({ error: "Beneficiary ID is required" });
    }
    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const isapplicationApproved = await BeneficiaryApplication.findOne({
      beneficiaryId: beneficiary_id,
      organizationId: req.organization._id,
      status: "approved",
    });
    if (!isapplicationApproved) {
      return res.status(400).json({
        error: "Beneficiary application not approved",
      });
    }

    const disbursement = await Disbursement.findOne({
      beneficiaryId: beneficiary_id,
      projectId: isapplicationApproved.projectId,
    });

    if (!disbursement) {
      return res.status(400).json({ error: "Disbursement Record not found" });
    }

    if (disbursement.verificationToken && !disbursement.tokenUsed) {
      return res
        .status(400)
        .json({ error: "Verification token already generated" });
    }

    const verificationToken = await generateUniqueToken();
    const tokenExpiryDate = new Date();
    tokenExpiryDate.setDate(tokenExpiryDate.getDate() + 7);

    const updatedDisbursement = await Disbursement.findOneAndUpdate(
      { _id: disbursement._id },
      {
        verificationToken: verificationToken,
        tokenExpiryDate: tokenExpiryDate,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Verification token generated successfully",
      updatedDisbursement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//BULK TOKEN GENERATION FOR ALL APPROVED APPLICATIONS
const generateVerificationTokens = async (req, res) => {
  const { projectIds } = req.body;
  if (!projectIds || !Array.isArray(projectIds)) {
    return res.status(400).json({ error: "Beneficiary IDs are required" });
  }
  if (!req.organization) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }

  try {
    const updatedDisbursements = [];
    const errors = [];

    for (const project_id of projectIds) {
      const isapplicationApproved = await BeneficiaryApplication.findOne({
        projectId: project_id,
        organizationId: req.organization._id,
        status: "approved",
      });
      if (!isapplicationApproved) {
        errors.push(`Beneficiary application not approved for ${project_id}`);
        continue;
      }

      const disbursement = await Disbursement.findOne({
        projectId: project_id,
      });
      if (!disbursement) {
        errors.push(`Disbursement not found for ${project_id}`);
        continue;
      }
      if (disbursement.verificationToken) {
        errors.push(`Verification token already generated for ${project_id}`);
        continue;
      }

      const verificationToken = await generateUniqueToken();
      const tokenExpiryDate = new Date();
      tokenExpiryDate.setDate(tokenExpiryDate.getDate() + 7);

      disbursement.verificationToken = verificationToken;
      disbursement.tokenExpiryDate = tokenExpiryDate;

      await disbursement.save();
      updatedDisbursements.push(disbursement);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Some errors occurred during token generation",
        error: errors,
      });
    }

    res.status(200).json({
      message: `Generated verification tokens for ${updatedDisbursements.length} beneficiaries`,
      disbursements: updatedDisbursements,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// This function verifies the token and completes the disbursement
const verifyAndCompleteDisbursement = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  let disbursement;
  try {
    disbursement = await Disbursement.findOne({
      verificationToken: token,
      status: "pending",
    });
    if (!disbursement) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (
      disbursement.tokenExpiryDate &&
      new Date() > disbursement.tokenExpiryDate
    ) {
      return res.status(400).json({ error: "Verification token has expired" });
    }

    disbursement.status = "disbursed";
    disbursement.tokenUsed = true;
    disbursement.tokenExpiryDate = null;
    disbursement.verificationToken = null;
    await disbursement.save();

    res.status(200).json({
      message: "Disbursement verified and completed successfully",
      disbursement,
    });
  } catch (error) {
    console.log(error);

    if (disbursement) {
      try {
        disbursement.status = "failed";
        disbursement.tokenUsed = true;
        disbursement.tokenExpiryDate = null;
        disbursement.verificationToken = null;
        await disbursement.save();
      } catch (saveError) {
        console.log(saveError);
      }
    }

    res.status(500).json({ error: "Server Error" });
  }
};

//Reject a beneficiary application
const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    if (!applicationId) {
      return res.status(400).json({ error: "Application ID is required" });
    }
    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const application = await BeneficiaryApplication.findOne({
      _id: applicationId,
      organizationId: req.organization._id,
    });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Check if application is already rejected
    if (application.status === "rejected") {
      return res
        .status(400)
        .json({ error: "Beneficiary application already rejected" });
    }

    const updatedApplication = await BeneficiaryApplication.findOneAndUpdate(
      { _id: applicationId, organizationId: req.organization._id },
      { status: "rejected" },
      { new: true }
    );
    res.status(200).json({
      message: "Beneficiary application rejected successfully",
      updatedApplication,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Delete Beneficiary Application
const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    if (!applicationId) {
      return res.status(400).json({ error: "Application ID is required" });
    }
    if (!req.organization) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const application = await BeneficiaryApplication.findOneAndDelete({
      _id: applicationId,
      organizationId: req.organization._id,
    });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error. Please try again " });
  }
};

module.exports = {
  submitApplication,
  approve_Beneficiary_Application,
  generateVerificationToken,
  generateVerificationTokens,
  verifyAndCompleteDisbursement,
  rejectApplication,
  deleteApplication,
};
