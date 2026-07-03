const mongoose = require("mongoose");
const { getTenantModel } = require("../Config/tenantConnection");
const { Organization } = require("../Database_Models/Models");

// Routine to scan all organization tenants and update past-due repayments to 'overdue'
const scanAndFlagOverdueInstallments = async () => {
  console.log("[Overdue-Scheduler] Starting daily repayment audit...");
  try {
    // Retrieve all active tenants from main Organization collection
    const orgs = await Organization.find({});
    
    if (orgs.length === 0) {
      console.log("[Overdue-Scheduler] No organizations registered yet. Skipping audit.");
      return;
    }

    const today = new Date();
    let updatedCount = 0;

    for (const org of orgs) {
      const subdomain = org.subdomain;
      try {
        const Disbursement = getTenantModel(subdomain, "Disbursement");

        // Run multi-tenant array-filters update
        const result = await Disbursement.updateMany(
          {
            "repaymentSchedule.dueDate": { $lt: today },
            "repaymentSchedule.status": "pending"
          },
          {
            $set: { "repaymentSchedule.$[elem].status": "overdue" }
          },
          {
            arrayFilters: [{ "elem.dueDate": { $lt: today }, "elem.status": "pending" }]
          }
        );

        if (result.modifiedCount > 0) {
          console.log(`[Overdue-Scheduler] Updated ${result.modifiedCount} installments to overdue for tenant: ${subdomain}`);
          updatedCount += result.modifiedCount;
        }
      } catch (err) {
        console.error(`[Overdue-Scheduler] Audit failed for tenant "${subdomain}":`, err.message);
      }
    }

    console.log(`[Overdue-Scheduler] Audit completed. Total overdue updates applied: ${updatedCount}`);
  } catch (error) {
    console.error("[Overdue-Scheduler] Global scheduler error:", error.message);
  }
};

// Initialize scheduler loop (runs every 12 hours)
const initOverdueScheduler = () => {
  // Trigger initial check on startup
  setTimeout(scanAndFlagOverdueInstallments, 5000);

  // Set recurring interval (12 hours = 43,200,000 milliseconds)
  setInterval(scanAndFlagOverdueInstallments, 43200000);
};

module.exports = {
  scanAndFlagOverdueInstallments,
  initOverdueScheduler
};
