const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
});

//Schema for Organization and subdomain
const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subdomain: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    suspendedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

//Schema for each user role of the organization
const userSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "manager", "field_agent", "viewer"],
      default: "viewer",
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

//Schema for Beneficiaries Applications
const beneficiarySchema = new mongoose.Schema(
  {
    personalDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      gender: { type: String, enum: ["male", "female"] },
      dateOfBirth: Date,
      phone: String,
      email: { type: String, required: true },
      password: { type: String, required: true },
      profilePhoto: { type: String, default: null },
      fingerprintHash: { type: String, default: null },
    },
    identification: {
      idType: {
        type: String,
        required: true,
        enum: ["passport", "national_id"],
      },
      idNumber: { type: String, required: true, unique: true, index: true },
      verified: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    suspendedUntil: { type: Date, default: null },
    location: {
      state: String,
      senatorialDistrict: String,
      lga: String,
      ward: String,
      pollingUnit: String,
    },
    agriculturalProfile: {
      cropsGrown: [{ type: String }],
      plots: [
        {
          polygon: {
            type: { type: String, enum: ["Polygon"], default: "Polygon" },
            coordinates: [[[Number]]]
          },
          hectarage: Number,
          tenureStatus: { type: String, enum: ["owned", "rented", "communal"] }
        }
      ],
      householdSize: Number,
      vulnerabilityFlags: {
        isFemaleHead: { type: Boolean, default: false },
        hasDisability: { type: Boolean, default: false }
      }
    },
    farmerIdNumber: { type: String, unique: true, sparse: true },
    // The redemption/disbursement center this farmer is routed to (assigned by
    // matching the farmer's location against a center's coverage area).
    redemptionCenterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RedemptionCenter",
      default: null,
    },
    // The data collector / field agent who enrolled this farmer, if any.
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DataCollector",
      default: null,
    },
  },
  { timestamps: true }
);

beneficiarySchema.pre("save", function (next) {
  if (!this.farmerIdNumber) {
    const stateCode = this.location?.state
      ? this.location.state.substring(0, 3).toUpperCase()
      : "KTS";
    const randomSerial = Math.floor(100000 + Math.random() * 900000);
    this.farmerIdNumber = `AP-${stateCode}-${randomSerial}`;
  }
  next();
});

//BENEFICIARY APPLICATIONS
const beneficiaryApplication = new mongoose.Schema(
  {
    beneficiaryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },
    role: {
      type: String,
      default: "beneficiary",
    },
    customFormResponses: [
      {
        fieldId: { type: String, required: true },
        type: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: mongoose.Schema.Types.Mixed }
      }
    ]
  },
  { timestamps: true }
);
beneficiaryApplication.index(
  { beneficiaryId: 1, projectId: 1 },
  { unique: true }
);

//Schema for Projects posted by organization
const projectSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["loan", "grant", "subsidy", "palliative"] },
    budget: {
      amount: Number,
      currency: { type: String, default: "NGN" },
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["active", "completed", "suspended", "draft"],
      default: "active",
      index: true,
    },
    imageURL: { type: String, default: null },
    imagePublicId: {
      type: String,
    },
    // NEW: Custom form configuration
    hasCustomForm: {
      type: Boolean,
      default: false,
    },
    customForm: {
      fields: [
        {
          id: { type: String, required: true },
          type: {
            type: String,
            enum: [
              "text",
              "textarea",
              "select",
              "radio",
              "checkbox",
              "number",
              "email",
              "phone",
              "date",
              "file",
            ],
            required: true,
          },
          label: { type: String, required: true },
          placeholder: { type: String },
          required: { type: Boolean, default: false },
          options: [{ type: String }], // For select, radio, checkbox
          validation: {
            minLength: Number,
            maxLength: Number,
            pattern: String,
          },
          order: { type: Number, default: 0 },
        },
      ],
      title: { type: String, default: "Application Form" },
      description: { type: String },
      isActive: { type: Boolean, default: true },
    },
    // Salam crop-recovery valuation, set per project by the cooperative rather
    // than hardcoded in code. ratePerKg is in the project currency (NGN).
    salamCropRates: [
      {
        crop: { type: String, required: true },
        ratePerKg: { type: Number, required: true },
      },
    ],
    // Fallback ₦/kg used when a delivered crop isn't in salamCropRates.
    defaultCropRate: { type: Number, default: 300 },
  },
  { timestamps: true }
);

//Schema for Disbursement of funds to beneficiaries
const disbursementSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    beneficiaryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
      required: true,
      index: true,
    },
    currency: { type: String, default: "NGN" },
    // Principal cash value of the input package disbursed to the farmer.
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "disbursed", "failed"],
      default: "pending",
      index: true,
    },
    disbursementDate: Date,
    verificationToken: String,
    tokenExpiryDate: Date,
    tokenUsed: { type: Boolean, default: false },
    repaymentSchedule: [
      {
        dueDate: Date,
        amount: Number,
        // Amount recovered so far against this installment. The original
        // `amount` is never mutated, so partial crop/cash payments keep a
        // clean audit trail.
        paidAmount: { type: Number, default: 0 },
        status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
        repaymentType: { type: String, enum: ["Murabaha", "Salam"], default: "Murabaha" },
        paidAt: Date
      }
    ],
  },
  { timestamps: true }
);

//Schema for Wallet of beneficiaries
const walletSchema = new mongoose.Schema(
  {
    beneficiaryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
      required: true,
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "NGN" },
    status: {
      type: String,
      enum: ["active", "frozen", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

//Schema for Transactions on the wallet
const transactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    disbursementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disbursement",
    },
    type: {
      type: String,
      enum: ["credit", "debit", "refund"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    metadata: {
      reference: String,
      description: String,
      paymentGateway: String,
    },
  },
  { timestamps: true }
);

//Schema for Verification of beneficiaries
const verificationRecordSchema = new mongoose.Schema(
  {
    beneficiaryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
      required: true,
    },
    type: {
      type: String,
      enum: ["biometric", "token", "id"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      token: String,
      expiryDate: Date,
      attempts: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Schema for storing project reports
const reportSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    projectName: { type: String, required: true },
    budgetAllocated: { type: Number, required: true },
    status: {
      type: String,
      enum: ["in_progress", "completed", "delayed"],
      required: true,
    },
    milestonesAchieved: { type: Number, default: 0 },
    milestonesPending: { type: Number, default: 0 },
    challengesFaced: { type: String },
    stakeholderFeedback: { type: String },
    fundsDisbursed: { type: Number, required: true },
    fundsUtilized: { type: Number, required: true },
    financialRemarks: { type: String },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const locationReferenceSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, index: true },
    lga: { type: String, required: true, index: true },
    ward: { type: String, required: true, index: true },
    pollingUnits: [{ type: String }],
  },
  { timestamps: true }
);

// A redemption/disbursement center where farmers collect inputs. Owned by a
// cooperative, has its own login, and covers one or more locations. Farmers are
// routed to the center whose coverage matches their registered location.
const redemptionCenterSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactPhone: { type: String },
    // Areas this center serves; a farmer is assigned when their location matches.
    coverage: [
      {
        state: { type: String },
        lga: { type: String },
        ward: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

// A data collector / field agent registered by a cooperative admin to enroll
// farmers (and apply on their behalf) within their assigned locations.
const dataCollectorSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    // Locations this collector is authorized to register farmers in.
    assignedLocations: [
      {
        state: { type: String },
        lga: { type: String },
        ward: { type: String },
        pollingUnit: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
const Organization = mongoose.model("Organization", organizationSchema);
const User = mongoose.model("User", userSchema);
const Beneficiary = mongoose.model("Beneficiary", beneficiarySchema);
const Project = mongoose.model("Project", projectSchema);
const Disbursement = mongoose.model("Disbursement", disbursementSchema);
const Wallet = mongoose.model("Wallet", walletSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const VerificationRecord = mongoose.model(
  "VerificationRecord",
  verificationRecordSchema
);
const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: "Beneficiary", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    // Links the physical input voucher back to its financing disbursement,
    // so redemption and repayment sit on one ledger.
    disbursementId: { type: mongoose.Schema.Types.ObjectId, ref: "Disbursement", default: null },
    itemDetails: {
      itemName: { type: String, required: true },
      quantity: { type: Number, default: 1 }
    },
    status: { type: String, enum: ["unused", "redeemed", "expired"], default: "unused" },
    redeemedAt: Date,
    redeemedBy: String
  },
  { timestamps: true }
);

const BeneficiaryApplication = mongoose.model(
  "BeneficiaryApplication",
  beneficiaryApplication
);
const Report = mongoose.model("Report", reportSchema);
const LocationReference = mongoose.model("LocationReference", locationReferenceSchema);
const Voucher = mongoose.model("Voucher", voucherSchema);
const RedemptionCenter = mongoose.model("RedemptionCenter", redemptionCenterSchema);
const DataCollector = mongoose.model("DataCollector", dataCollectorSchema);

const schemas = {
  Admin: adminSchema,
  Organization: organizationSchema,
  User: userSchema,
  Beneficiary: beneficiarySchema,
  Project: projectSchema,
  Disbursement: disbursementSchema,
  Wallet: walletSchema,
  Transaction: transactionSchema,
  VerificationRecord: verificationRecordSchema,
  BeneficiaryApplication: beneficiaryApplication,
  Report: reportSchema,
  LocationReference: locationReferenceSchema,
  Voucher: voucherSchema,
  RedemptionCenter: redemptionCenterSchema,
  DataCollector: dataCollectorSchema,
};

module.exports = {
  Admin,
  Organization,
  User,
  Beneficiary,
  Project,
  Disbursement,
  Wallet,
  Transaction,
  VerificationRecord,
  BeneficiaryApplication,
  Report,
  LocationReference,
  Voucher,
  RedemptionCenter,
  DataCollector,
  schemas,
};
