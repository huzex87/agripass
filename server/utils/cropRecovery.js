// Pure helpers for Salam crop-recovery, extracted so the valuation and
// credit-application logic can be unit-tested without a database.

// Resolve the ₦/kg rate for a delivered crop from the project's configured
// salamCropRates (case-insensitive), falling back to the project default,
// then a hard floor of 300.
const resolveCropRate = (project, cropType) => {
  const rates = Array.isArray(project?.salamCropRates) ? project.salamCropRates : [];
  const match = rates.find(
    (r) => r.crop && cropType && r.crop.toLowerCase().trim() === cropType.toLowerCase().trim()
  );
  if (match && typeof match.ratePerKg === "number") return match.ratePerKg;
  if (typeof project?.defaultCropRate === "number") return project.defaultCropRate;
  return 300;
};

// Apply a pool of credit across a repayment schedule's unpaid Salam
// installments. Increments each installment's paidAmount (never mutating the
// original `amount`, preserving the audit trail); marks an installment paid
// only once fully covered. Returns how much credit was left over and how many
// installments were fully cleared.
const applyCropCredit = (repaymentSchedule, credit) => {
  let remaining = credit;
  let clearedInstallmentsCount = 0;

  for (const inst of repaymentSchedule) {
    if (remaining <= 0) break;
    if (inst.repaymentType !== "Salam" || inst.status === "paid") continue;

    const alreadyPaid = inst.paidAmount || 0;
    const outstanding = inst.amount - alreadyPaid;
    if (outstanding <= 0) continue;

    if (remaining >= outstanding) {
      inst.paidAmount = inst.amount;
      inst.status = "paid";
      inst.paidAt = new Date();
      remaining -= outstanding;
      clearedInstallmentsCount++;
    } else {
      inst.paidAmount = alreadyPaid + remaining;
      remaining = 0;
    }
  }

  return { remainingCredit: remaining, clearedInstallmentsCount };
};

module.exports = { resolveCropRate, applyCropCredit };
