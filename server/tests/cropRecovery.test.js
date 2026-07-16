const { test } = require("node:test");
const assert = require("node:assert");
const { resolveCropRate, applyCropCredit } = require("../utils/cropRecovery");
const { parseCropRates } = require("../Controllers/Clients/CreateProject");

test("parseCropRates handles arrays, JSON strings, and drops invalid rows", () => {
  assert.deepEqual(parseCropRates([{ crop: "Wheat", ratePerKg: 450 }]), [
    { crop: "Wheat", ratePerKg: 450 },
  ]);
  // JSON string (multipart form path)
  assert.deepEqual(parseCropRates('[{"crop":"Rice","ratePerKg":400}]'), [
    { crop: "Rice", ratePerKg: 400 },
  ]);
  // invalid rows dropped: missing crop, non-numeric / non-positive rate
  assert.deepEqual(
    parseCropRates([
      { crop: "", ratePerKg: 100 },
      { crop: "Maize", ratePerKg: 0 },
      { crop: "Sorghum", ratePerKg: "abc" },
      { crop: "  Millet  ", ratePerKg: 320 },
    ]),
    [{ crop: "Millet", ratePerKg: 320 }]
  );
  assert.deepEqual(parseCropRates(undefined), []);
  assert.deepEqual(parseCropRates("not json"), []);
});

const project = {
  salamCropRates: [
    { crop: "Wheat", ratePerKg: 450 },
    { crop: "Rice", ratePerKg: 400 },
  ],
  defaultCropRate: 300,
};

test("resolveCropRate uses configured rate (case/space insensitive)", () => {
  assert.equal(resolveCropRate(project, "wheat"), 450);
  assert.equal(resolveCropRate(project, " RICE "), 400);
});

test("resolveCropRate falls back to project default, then hard floor", () => {
  assert.equal(resolveCropRate(project, "millet"), 300); // default
  assert.equal(resolveCropRate({}, "sorghum"), 300); // hard floor when nothing set
  assert.equal(resolveCropRate({ defaultCropRate: 250 }, "sorghum"), 250);
});

test("applyCropCredit clears fully-covered installments and preserves amount", () => {
  const schedule = [
    { repaymentType: "Salam", amount: 1000, paidAmount: 0, status: "pending" },
    { repaymentType: "Salam", amount: 1000, paidAmount: 0, status: "overdue" },
  ];
  const { remainingCredit, clearedInstallmentsCount } = applyCropCredit(schedule, 1500);
  assert.equal(clearedInstallmentsCount, 1);
  assert.equal(remainingCredit, 0);
  // First installment fully paid, amount untouched (audit trail intact).
  assert.equal(schedule[0].status, "paid");
  assert.equal(schedule[0].amount, 1000);
  assert.equal(schedule[0].paidAmount, 1000);
  // Second installment partially paid, still pending, amount NOT mutated.
  assert.equal(schedule[1].status, "overdue");
  assert.equal(schedule[1].amount, 1000);
  assert.equal(schedule[1].paidAmount, 500);
});

test("applyCropCredit skips Murabaha and already-paid installments", () => {
  const schedule = [
    { repaymentType: "Murabaha", amount: 500, paidAmount: 0, status: "pending" },
    { repaymentType: "Salam", amount: 500, paidAmount: 500, status: "paid" },
    { repaymentType: "Salam", amount: 500, paidAmount: 0, status: "pending" },
  ];
  const { clearedInstallmentsCount } = applyCropCredit(schedule, 500);
  assert.equal(clearedInstallmentsCount, 1);
  assert.equal(schedule[0].status, "pending"); // Murabaha untouched
  assert.equal(schedule[2].status, "paid"); // the only eligible Salam one
});

test("applyCropCredit resumes from prior partial payment", () => {
  const schedule = [
    { repaymentType: "Salam", amount: 1000, paidAmount: 400, status: "pending" },
  ];
  const { remainingCredit, clearedInstallmentsCount } = applyCropCredit(schedule, 600);
  assert.equal(clearedInstallmentsCount, 1);
  assert.equal(remainingCredit, 0);
  assert.equal(schedule[0].paidAmount, 1000);
  assert.equal(schedule[0].status, "paid");
});
