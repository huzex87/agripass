const crypto = require("crypto");
const { Organization, Disbursement } = require("../../Database_Models/Models");

const generateUniqueToken = async () => {
  const companyName = "dis";
  let token;
  let isUnique = false;

  while (!isUnique) {
    const randomBytes = crypto.randomBytes(4).toString("hex");
    token = `${companyName}-${randomBytes}`;
    const isTokenExist = await Disbursement.findOne({
      verificationToken: token,
    });
    if (!isTokenExist) {
      isUnique = true;
    }
  }
  return token;
};

// Function to generate a unique subdomain for an organization
const generateSubdomain = async (name) => {
  const subdomain = name.toLowerCase().replace(/\s+/g, "-");
  const organization = await Organization.findOne({ subdomain });
  if (organization) {
    throw new Error("Organization already exists");
  }
  return subdomain;
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

module.exports = {
  generateUniqueToken,
  generateSubdomain,
  generateRefreshToken,
};
