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
const { authMiddleware, adminAuthMiddleware, requireRole } = require("../Middlewares/Auth_Middleware");
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
const {
  requestPasswordReset,
  verifyResetOtp,
  resetPassword,
} = require("../Controllers/PasswordReset");
const {
  createCenter,
  getCenters,
  suspendCenter,
  activateCenter,
  assignFarmersToCenters,
  loginCenter,
  getCenterDashboard,
  redeemVoucherAtCenter,
} = require("../Controllers/Clients/CenterController");
const {
  createCollector,
  getCollectors,
  suspendCollector,
  activateCollector,
  loginCollector,
  getCollectorDashboard,
  registerFarmerByCollector,
  applyForFarmer,
  getCollectorProjects,
} = require("../Controllers/Clients/CollectorController");

// router.use(authMiddleware);

//BENEFICIARY ROUTES
router.post("/beneficiary/login", loginBeneficiary); // Login Endpoint Beneficiary
router.post("/register", registerBeneficiary); //Beneficiary Sign up Endpoint
router.post("/submit", authMiddleware, requireRole("beneficiary"), submitApplication); //Beneficiary Application Endpoint
router.post("/submit/:projectId", checkSubdomain, requireRole("beneficiary"), submitApplication);

// Marketplace-style browsing for beneficiaries (global accounts, not tied to one cooperative's subdomain)
router.get("/beneficiary/projects", authMiddleware, requireRole("beneficiary"), getPublicActiveProjects);
router.get("/beneficiary/project/:projectId", authMiddleware, requireRole("beneficiary"), getPublicProjectDetails);

// PASSWORD RESET ROUTES (beneficiary, organization, and admin accounts)
router.post("/forgot-password", requestPasswordReset);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

// REDEMPTION CENTER ROUTES
// Public center login:
router.post("/center/login", loginCenter);
// Cooperative-admin management of its centers:
router.post("/centers", checkSubdomain, requireRole("organization"), createCenter);
router.get("/centers", checkSubdomain, requireRole("organization"), getCenters);
router.put("/centers/:centerId/suspend", checkSubdomain, requireRole("organization"), suspendCenter);
router.put("/centers/:centerId/activate", checkSubdomain, requireRole("organization"), activateCenter);
router.post("/centers/assign-farmers", checkSubdomain, requireRole("organization"), assignFarmersToCenters);
// Center-role dashboard:
router.get("/center/dashboard", authMiddleware, requireRole("center"), getCenterDashboard);
router.post("/center/redeem-voucher", authMiddleware, requireRole("center"), redeemVoucherAtCenter);

// DATA COLLECTOR ROUTES
// Public collector login:
router.post("/collector/login", loginCollector);
// Cooperative-admin management of its collectors:
router.post("/collectors", checkSubdomain, requireRole("organization"), createCollector);
router.get("/collectors", checkSubdomain, requireRole("organization"), getCollectors);
router.put("/collectors/:collectorId/suspend", checkSubdomain, requireRole("organization"), suspendCollector);
router.put("/collectors/:collectorId/activate", checkSubdomain, requireRole("organization"), activateCollector);
// Collector-role actions:
router.get("/collector/dashboard", authMiddleware, requireRole("collector"), getCollectorDashboard);
router.get("/collector/projects", authMiddleware, requireRole("collector"), getCollectorProjects);
router.post("/collector/register-farmer", authMiddleware, requireRole("collector"), registerFarmerByCollector);
router.post("/collector/apply", authMiddleware, requireRole("collector"), applyForFarmer);

//STAKEHOLDERS ROUTES
router.post("/login", loginOrganization); // Login Endpoint Org
router.post("/refresh", refreshTokenHandler); // Token Refresh Endpoint
router.post("/logout", logoutHandler);
router.post("/logout-all", logoutAllHandler);
router.post("/create", registerOrganization); // Register Organization Endpoint

// Read-only, accessible to both organization staff and browsing beneficiaries
router.get("/projects", checkSubdomain, checkSuspensionStatus, getActiveProjects);
router.get("/project_details/:projectId", checkSubdomain, checkSuspensionStatus, getProjectDetails); //Get specific project details

// Organization-only management endpoints
router.post(
  "/create_project",
  checkSubdomain,
  requireRole("organization"),
  checkSuspensionStatus,
  upload.single("image"),
  createProject
); // Organization create Project Endpoint
router.put(
  "/project/:projectId",
  checkSubdomain,
  requireRole("organization"),
  checkSuspensionStatus,
  upload.single("image"),
  updateProject
); // Update core project details
router.put("/project/:projectId/form", checkSubdomain, requireRole("organization"), checkSuspensionStatus, updateForm);
router.put("/complete_project/:projectId", checkSubdomain, requireRole("organization"), checkSuspensionStatus, markAsCompleted); //Deactivate a project
router.put("/suspend_project/:projectId", checkSubdomain, requireRole("organization"), checkSuspensionStatus, suspendProject); //Suspend a project
router.delete("/delete_project/:projectId", checkSubdomain, requireRole("organization"), checkSuspensionStatus, deleteResource); //Delete a project
router.put("/activate_project/:projectId", checkSubdomain, requireRole("organization"), checkSuspensionStatus, activateProject); //Activate a project
router.post("/create_report", checkSubdomain, requireRole("organization"), checkSuspensionStatus, createProjectReport); //Create project report

router.put(
  "/approve_application/:application_Id",
  checkSubdomain,
  requireRole("organization"),
  checkSuspensionStatus,
  approve_Beneficiary_Application
); // Beneficiary's Application Approved Endpoint
router.get("/applications", checkSubdomain, requireRole("organization"), checkSuspensionStatus, getAllApplications); //Get all applications
router.delete(
  "/delete_application/:applicationId",
  checkSubdomain,
  requireRole("organization"),
  checkSuspensionStatus,
  deleteApplication
); //Delete Beneficiary Application

router.put("/reject/:applicationId", checkSubdomain, requireRole("organization"), checkSuspensionStatus, rejectApplication); //Reject a beneficiary application
router.get("/beneficiaries", checkSubdomain, requireRole("organization"), checkSuspensionStatus, recentBeneficaryApplications); //Get recent beneficiary sign up

router.put(
  "/generate_token/:beneficiary_id",
  checkSubdomain,
  requireRole("organization"),
  checkSuspensionStatus,
  generateVerificationToken
); // Unique verification token generation

router.post("/generate_tokens", checkSubdomain, requireRole("organization"), checkSuspensionStatus, generateVerificationTokens); //Multiple verification token generation
router.post("/verify", checkSubdomain, requireRole("organization"), checkSuspensionStatus, verifyAndCompleteDisbursement); // Verify token endpoint & complete disbursement
router.get("/resources", checkSubdomain, requireRole("organization"), checkSuspensionStatus, trackResources); // Track resources endpoint
router.get("/disbursements", checkSubdomain, requireRole("organization"), checkSuspensionStatus, trackDisbursement); // Track disbursements endpoint

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
router.get("/location/states", getStates);
router.get("/location/lgas", getLgas);
router.get("/location/wards", getWards);
router.get("/location/polling-units", getPollingUnits);

// REPAYMENT LEDGER ROUTES (Murabaha/Salam Financing)
router.get("/farmer/repayments", checkSubdomain, requireRole("beneficiary"), getFarmerRepayments);
router.post("/farmer/repay", checkSubdomain, requireRole("beneficiary"), submitRepayment);
router.get("/organization/repayments", checkSubdomain, requireRole("organization"), getOrganizationRepayments);
router.get("/farmer/wallet", checkSubdomain, requireRole("beneficiary"), getFarmerWallet);
router.get("/farmer/profile", checkSubdomain, requireRole("beneficiary"), getFarmerProfile);

// INPUT VOUCHER VERIFICATION ROUTES
router.post("/voucher/generate", checkSubdomain, requireRole("organization"), generateVoucher);
router.post("/voucher/redeem", checkSubdomain, requireRole("organization"), redeemVoucher);
router.get("/farmer/vouchers", checkSubdomain, requireRole("beneficiary"), getFarmerVouchers);

// INPUT CROP RECOVERY ROUTES (Salam Contracts)
router.post("/warehouse/crop-recovery", checkSubdomain, requireRole("organization"), submitCropRecovery);

module.exports = router;
