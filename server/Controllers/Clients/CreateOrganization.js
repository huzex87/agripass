const { Organization } = require("../../Database_Models/Models");
const { generateSubdomain } = require("../Utils/tokenUtils");
const bcrypt = require("bcrypt");

const registerOrganization = async (req, res) => {
  try {
    const { orgName, email, password } = req.body;
    if (!orgName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const isOrganizationExist = await Organization.findOne({ orgName });
    if (isOrganizationExist) {
      return res.status(400).json({ error: "Organization already exists" });
    }

    const isEmailExist = await Organization.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({
        error: "Organization with this email already exists. Try again",
      });
    }

    const subdomain = await generateSubdomain(orgName);
    const newOrganization = new Organization({
      name: orgName,
      subdomain,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    newOrganization.password = await bcrypt.hash(password, salt);
    await newOrganization.save();

    res.status(200).json({
      message: "Organization registered successfully",
      subdomain: newOrganization.subdomain,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { registerOrganization };
