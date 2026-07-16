const { scanAndFlagOverdueInstallments } = require("../utils/OverdueScheduler");

// Endpoint that Vercel Cron (or any external scheduler) calls to run the
// overdue-installment sweep. In-process setInterval does not survive on
// serverless, so this is the production path for that job.
//
// Protected by CRON_SECRET: Vercel Cron sends `Authorization: Bearer <secret>`
// when CRON_SECRET is set in the project env. If no secret is configured we
// still allow it (dev convenience) but log a warning.
const runOverdueSweep = async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.header("Authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    console.warn("[Cron] CRON_SECRET not set — overdue endpoint is unprotected.");
  }

  try {
    const result = await scanAndFlagOverdueInstallments();
    return res.status(200).json({
      status: "success",
      message: "Overdue sweep completed",
      modified: result?.modifiedCount ?? null,
    });
  } catch (error) {
    console.error("[Cron] Overdue sweep failed:", error.message);
    return res.status(500).json({ error: "Overdue sweep failed" });
  }
};

module.exports = { runOverdueSweep };
