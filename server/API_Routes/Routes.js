const express = require("express");
const router = express.Router();
const {
  registerOrganization,
} = require("../Controllers/Clients/CreateOrganization");
const {
  registerBeneficiary,
} = require("../Controllers/Clients/BeneficiarySignup");
const { checkSubdomain } = require("../Middlewares/Domain_Middleware");
const {
  createProject,
  getActiveProjects,
  markAsCompleted,
  deleteResource,
  getProjectDetails,
  suspendProject,
  activateProject,
  updateForm,
  upload,
} = require("../Controllers/Clients/CreateProject");
const {
  submitApplication,
  approve_Beneficiary_Application,
  generateVerificationToken,
  generateVerificationTokens,
  verifyAndCompleteDisbursement,
  rejectApplication,
  deleteApplication,
} = require("../Controllers/Clients/BeneficiaryApplication");
const {
  loginBeneficiary,
  loginOrganization,
  loginAdmin,
  refreshTokenHandler,
  logoutHandler,
  logoutAllHandler,
} = require("../Controllers/Login");
const { authMiddleware, adminAuthMiddleware } = require("../Middlewares/Auth_Middleware");
const {
  viewProjects,
  deactivateProject,
  deleteProject,
  createProjectReport,
} = require("../Controllers/Admin/Manage_Resources");
const {
  getAllOrganizations,
  suspendOrganization,
} = require("../Controllers/Admin/Manage_User");
const {
  trackResources,
  trackDisbursement,
} = require("../Controllers/Clients/TrackResources");
const {
  recentBeneficaryApplications,
} = require("../Controllers/Clients/TrackBeneficiaries");
const { getStates, getLgas, getWards, getPollingUnits } = require("../Controllers/LocationController");
const {
  getFarmerRepayments,
  submitRepayment,
  getOrganizationRepayments,
  getFarmerWallet,
  getFarmerProfile
} = require("../Controllers/Clients/RepaymentController");
const {
  generateVoucher,
  redeemVoucher,
  getFarmerVouchers
} = require("../Controllers/Clients/VoucherController");
const { submitCropRecovery } = require("../Controllers/Clients/CropController");
const {
  getAllApplications,
} = require("../Controllers/Clients/TrackBeneficiaryApplications");
const { checkSuspensionStatus } = require("../Controllers/Utils/CheckSuspensionStatus");

// router.use(authMiddleware);

//BENEFICIARY ROUTES
router.post("/beneficiary/login", loginBeneficiary); // Login Endpoint Beneficiary
router.post("/register", registerBeneficiary); //Beneficiary Sign up Endpoint
router.post("/submit", authMiddleware, submitApplication); //Beneficiary Application Endpoint
router.post("/submit/:projectId", checkSubdomain, authMiddleware, submitApplication);

//STAKEHOLDERS ROUTES
router.post("/login", loginOrganization); // Login Endpoint Org
router.post("/refresh", refreshTokenHandler); // Token Refresh Endpoint
router.post("/logout", logoutHandler);
router.post("/logout-all", logoutAllHandler);
router.post("/create", registerOrganization); // Register Organization Endpoint

router.get("/projects", checkSubdomain, checkSuspensionStatus, getActiveProjects);
router.post(
  "/create_project",
  checkSubdomain,
  checkSuspensionStatus,
  upload.single("image"),
  createProject
); // Organization create Project Endpoint
router.put("/project/:projectId/form", checkSubdomain, checkSuspensionStatus, updateForm);
router.put("/complete_project/:projectId", checkSubdomain, checkSuspensionStatus, markAsCompleted); //Deactivate a project
router.get("/project_details/:projectId", checkSubdomain, checkSuspensionStatus, getProjectDetails); //Get specific project details
router.put("/suspend_project/:projectId", checkSubdomain, checkSuspensionStatus, suspendProject); //Suspend a project
router.delete("/delete_project/:projectId", checkSubdomain, checkSuspensionStatus, deleteResource); //Delete a project
router.put("/activate_project/:projectId", checkSubdomain, checkSuspensionStatus, activateProject); //Activate a project
router.post("/create_report", checkSubdomain, checkSuspensionStatus, createProjectReport); //Create project report

router.put(
  "/approve_application/:application_Id",
  checkSubdomain,
  checkSuspensionStatus,
  approve_Beneficiary_Application
); // Beneficiary's Application Approved Endpoint
router.get("/applications", checkSubdomain, checkSuspensionStatus, getAllApplications); //Get all applications
router.delete(
  "/delete_application/:applicationId",
  checkSubdomain,
  checkSuspensionStatus,
  deleteApplication
); //Delete Beneficiary Application

router.put("/reject/:applicationId", checkSubdomain, checkSuspensionStatus, rejectApplication); //Reject a beneficiary application
router.get("/beneficiaries", checkSubdomain, checkSuspensionStatus, recentBeneficaryApplications); //Get recent beneficiary sign up

router.put(
  "/generate_token/:beneficiary_id",
  checkSubdomain,
  checkSuspensionStatus,
  generateVerificationToken
); // Unique verification token generation

router.post("/generate_tokens", checkSubdomain, checkSuspensionStatus, generateVerificationTokens); //Multiple verification token generation
router.post("/verify", checkSubdomain, checkSuspensionStatus, verifyAndCompleteDisbursement); // Verify token endpoint & complete disbursement
router.get("/resources", checkSubdomain, checkSuspensionStatus, trackResources); // Track resources endpoint
router.get("/disbursements", checkSubdomain, checkSuspensionStatus, trackDisbursement); // Track disbursements endpoint

//ADMIN ROUTES
router.post("/admin/login", loginAdmin); // Admin Login Endpoint
router.get("/admin/organizations", adminAuthMiddleware, getAllOrganizations); //Get all organizations
router.post("/admin/create", adminAuthMiddleware, registerOrganization); //Admin create organization
router.put(
  "/admin/suspend_organization/:orgId",
  adminAuthMiddleware,
  suspendOrganization
); //Suspend an organization
router.get("/admin/projects", adminAuthMiddleware, viewProjects); //View all projects
router.put("/admin/deactivate_project/:projectId", adminAuthMiddleware, deactivateProject); //Deactivate a project
router.delete("/admin/delete_project/:projectId", adminAuthMiddleware, deleteProject); //Delete a project
router.post("/admin/create_report", adminAuthMiddleware, createProjectReport); //Create project report

// LOCATION REFERENCE ROUTES (INEC Geography Picker)
router.get("/location/states", checkSubdomain, getStates);
router.get("/location/lgas", checkSubdomain, getLgas);
router.get("/location/wards", checkSubdomain, getWards);
router.get("/location/polling-units", checkSubdomain, getPollingUnits);

// REPAYMENT LEDGER ROUTES (Murabaha/Salam Financing)
router.get("/farmer/repayments", checkSubdomain, authMiddleware, getFarmerRepayments);
router.post("/farmer/repay", checkSubdomain, authMiddleware, submitRepayment);
router.get("/organization/repayments", checkSubdomain, authMiddleware, getOrganizationRepayments);
router.get("/farmer/wallet", checkSubdomain, authMiddleware, getFarmerWallet);
router.get("/farmer/profile", checkSubdomain, authMiddleware, getFarmerProfile);

// INPUT VOUCHER VERIFICATION ROUTES
router.post("/voucher/generate", checkSubdomain, authMiddleware, generateVoucher);
router.post("/voucher/redeem", checkSubdomain, authMiddleware, redeemVoucher);
router.get("/farmer/vouchers", checkSubdomain, authMiddleware, getFarmerVouchers);

// INPUT CROP RECOVERY ROUTES (Salam Contracts)
router.post("/warehouse/crop-recovery", checkSubdomain, authMiddleware, submitCropRecovery);

module.exports = router;
