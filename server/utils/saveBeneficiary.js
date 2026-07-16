// Saves a Beneficiary document, retrying only when the auto-generated
// farmerIdNumber collides. A duplicate on any other unique field (e.g. the
// real idNumber or email) is a genuine conflict and is re-thrown immediately.
const saveBeneficiaryWithUniqueId = async (beneficiary, attempts = 5) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await beneficiary.save();
    } catch (err) {
      const isFarmerIdClash =
        err.code === 11000 && err.keyPattern && err.keyPattern.farmerIdNumber;
      if (isFarmerIdClash && i < attempts - 1) {
        // Clear it so the pre-save hook regenerates a fresh code on retry.
        beneficiary.farmerIdNumber = undefined;
        continue;
      }
      throw err;
    }
  }
};

module.exports = { saveBeneficiaryWithUniqueId };
