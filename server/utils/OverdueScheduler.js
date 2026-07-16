const { Disbursement } = require("../Database_Models/Models");

// Routine to scan all disbursements and update past-due repayments to 'overdue'
const scanAndFlagOverdueInstallments = async () => {
  console.log("[Overdue-Scheduler] Starting daily repayment audit...");
  try {
    const today = new Date();

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

    console.log(`[Overdue-Scheduler] Audit completed. Total overdue updates applied: ${result.modifiedCount}`);
    return result;
  } catch (error) {
    console.error("[Overdue-Scheduler] Scheduler error:", error.message);
    throw error;
  }
};

// Initialize scheduler loop (runs every 12 hours) — only on persistent hosts.
// On Vercel (serverless) setInterval does not survive between invocations, so
// the job is driven by Vercel Cron hitting /api/v1/cron/overdue instead.
const initOverdueScheduler = () => {
  if (process.env.VERCEL) {
    console.log("[Overdue-Scheduler] Serverless detected — relying on Vercel Cron endpoint.");
    return;
  }
  // Trigger initial check on startup
  setTimeout(() => scanAndFlagOverdueInstallments().catch(() => {}), 5000);

  // Set recurring interval (12 hours = 43,200,000 milliseconds)
  setInterval(() => scanAndFlagOverdueInstallments().catch(() => {}), 43200000);
};

module.exports = {
  scanAndFlagOverdueInstallments,
  initOverdueScheduler
};
