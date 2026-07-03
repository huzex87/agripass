const { Organization } = require("../Database_Models/Models");
const jwt = require("jsonwebtoken");

const checkSubdomain = async (req, res, next) => {
  try {
    const host = req.hostname;
    const subdomain = req.headers["x-subdomain"] || host.split(".")[0];

    const authHeader = req.header("Authorization") || req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const organization = await Organization.findOne({ subdomain });
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    if (organization._id.toString() !== decoded.id) {
      return res.status(400).json({ error: "Organization-token mismatch" });
    }

    req.organization = organization;
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
module.exports = { checkSubdomain };
