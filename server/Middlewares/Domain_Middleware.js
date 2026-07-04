const { Organization, Beneficiary } = require("../Database_Models/Models");
const jwt = require("jsonwebtoken");

const checkSubdomain = async (req, res, next) => {
  try {
    const host = req.hostname;
    const subdomain = req.headers["x-subdomain"] || host.split(".")[0];

    const authHeader = req.header("Authorization") || req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const organization = await Organization.findOne({ subdomain });
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    if (decoded.role === "beneficiary") {
      const beneficiary = await Beneficiary.findById(decoded.id);
      if (!beneficiary) {
        return res.status(401).json({ error: "Farmer beneficiary not found" });
      }
      // Beneficiaries are global accounts that can apply to projects across
      // multiple cooperatives, so they have no single organizationId to
      // compare against. Org affiliation is tracked per-application instead.
      req.user = decoded;
      req.beneficiary = beneficiary;
    } else if (decoded.role === "organization") {
      if (organization._id.toString() !== decoded.id) {
        return res.status(400).json({ error: "Organization-token mismatch" });
      }
      req.user = decoded;
    } else {
      return res.status(400).json({ error: "Invalid role access" });
    }

    req.organization = organization;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
module.exports = { checkSubdomain };
