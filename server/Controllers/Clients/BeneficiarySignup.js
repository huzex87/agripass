const { Beneficiary } = require("../../Database_Models/Models");
const bcrypt = require("bcrypt");

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
    !lga
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let isBeneficiaryExist = await Beneficiary.findOne({
      "identification.idNumber": idNumber,
    });
    if (isBeneficiaryExist) {
      return res.status(400).json({ error: "Beneficiary with this ID number already exists" });
    }

    let isEmailExist = await Beneficiary.findOne({
      "personalDetails.email": email,
    });
    if (isEmailExist) {
      return res.status(400).json({ error: "Email address is already registered by another beneficiary" });
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
      },
    });

    const salt = await bcrypt.genSalt(10);
    beneficiary.personalDetails.password = await bcrypt.hash(password, salt);
    await beneficiary.save();

    res.status(200).json({
      message: "Beneficiary registered successfully",
      beneficiary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { registerBeneficiary };
