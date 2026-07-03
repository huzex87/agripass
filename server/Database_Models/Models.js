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
      enum: ["active", "inactive"],
      default: "active",
    },
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
    farmerIdNumber: { type: String, unique: true, sparse: true }
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
  Voucher: voucherSchema
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
  schemas,
};
