const { Organization } = require("../../Database_Models/Models");

const checkSuspensionStatus = async (req, res, next) => {
  try {
    const { _id } = req.organization;
    if (!_id) {
      return res.status(400).json({ error: "Organization ID is required" });
    }

    const organization = await Organization.findById(_id);
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    if (organization.status === "suspended") {
      const currentDate = new Date();
      if (
        organization.suspendedUntil &&
        organization.suspendedUntil > currentDate
      ) {
        return res.status(403).json({
          error: `Organization is suspended until ${organization.suspendedUntil.toISOString()}`,
        });
      } else {
        // If the suspension period has ended, reactivate the organization
        organization.status = "active";
        organization.suspendedUntil = null;
        await organization.save();
      }
    }
    next();
  } catch (error) {
    console.error("Error checking suspension status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { checkSuspensionStatus };
