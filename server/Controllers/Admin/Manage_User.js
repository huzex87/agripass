const { Organization, Beneficiary } = require("../../Database_Models/Models");
const { generateSubdomain } = require("../Utils/tokenUtils");
const bcrypt = require("bcrypt");

//ADMIN ADD REGISTER ORGANIZATION CONTROLLER
const registerOrganization = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const subdomain = await generateSubdomain(name);
    const newOrganization = new Organization({
      name,
      subdomain,
      email,
      phone,
      address,
    });
    await newOrganization.save();
    res.status(200).json({
      message: "Organization registered successfully",
      subdomain: newOrganization,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//ADMIN REGISTER BENEFICIARY CONTROLLER
const registerBeneficiary = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    phone,
    email,
    password,
    idType,
    idNumber,
    state,
    lga,
    ward,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !gender ||
    !dateOfBirth ||
    !phone ||
    !email ||
    !password ||
    !idType ||
    !idNumber ||
    !state ||
    !lga ||
    !ward
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let isBeneficiaryExist = await Beneficiary.findOne({
      "identification.idNumber": idNumber,
    });
    if (isBeneficiaryExist) {
      return res.status(400).json({ error: "Beneficiary already exist" });
    }

    const beneficiary = new Beneficiary({
      personalDetails: {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dateOfBirth,
        phone: phone,
        email: email,
        password: password,
      },
      identification: {
        idType: idType,
        idNumber: idNumber,
      },
      status: "pending",
      location: {
        state: state,
        lga: lga,
        ward: ward,
      },
    });

    // Hash Beneficiary Password and Save to the database
    const salt = await bcrypt.genSalt(10);
    beneficiary.password = await bcrypt.hash(password, salt);
    await beneficiary.save();

    res.status(200).json({
      message: "Beneficiary registered successfully",
      beneficiaryId: beneficiary._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//SUSPEND BEBEFICIARY REGISTRATION
const suspendBeneficiary = async (req, res) => {
  const { beneficiaryId } = req.params;
  const { suspendedDays } = req.body;

  if (!suspendedDays || !suspendedDays <= 0) {
    return res.status(400).json({
      error: "Valid suspended days is required",
    });
  }

  try {
    const suspendedUntil = new Date();
    suspendedUntil.setDate(suspendedUntil.getDate() + suspendedDays);

    const beneficiary = await Beneficiary.findByIdAndUpdate(
      beneficiaryId,
      {
        status: "suspended",
        suspendedUntil,
      },
      { new: true }
    );
    if (!beneficiary) {
      return res.status(404).json({ error: "Beneficiary not found" });
    }

    res.status(200).json({
      message: `Beneficiary suspended successfully until ${suspendedUntil.toISOString()}`,
      beneficiary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Verify Beneficiary
const verifyBeneficiary = async (req, res) => {
  const { beneficiaryId } = req.params;
  try {
    const beneficiary = await Beneficiary.findByIdAndUpdate(
      beneficiaryId,
      {
        verified: true,
        status: "approved",
      },
      { new: true }
    );
    if (!beneficiary) {
      return res.status(404).json({ error: "Beneficiary not found" });
    }

    res.status(200).json({
      message: "Beneficiary verified successfully",
      beneficiary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//GET ALL ORGANIZATIONS
const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    if (organizations.length === 0) {
      return res.status(404).json({ message: "No organizations found" });
    }
    res.status(200).json({ organizations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//SUSPEND ORGANIZATION
const suspendOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { suspendedDays } = req.body;
    if (!suspendedDays || suspendedDays <= 0) {
      return res.status(400).json({
        error: "Valid suspended days is required",
      });
    }

    const suspendedUntil = new Date();
    suspendedUntil.setDate(suspendedUntil.getDate() + suspendedDays);

    const isOrgExist = await Organization.findById(orgId);
    if (!isOrgExist) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const organization = await Organization.findByIdAndUpdate(
      orgId,
      { status: "suspended", suspendedUntil },
      { new: true }
    );
    res.status(200).json({
      message: `Organization suspended successfully until ${suspendedUntil.toISOString()}`,
      organization,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  registerOrganization,
  registerBeneficiary,
  suspendBeneficiary,
  verifyBeneficiary,
  getAllOrganizations,
  suspendOrganization,
};
