const { test } = require("node:test");
const assert = require("node:assert");
const { saveBeneficiaryWithUniqueId } = require("../utils/saveBeneficiary");

const dupErr = (keyPattern) => {
  const e = new Error("E11000 duplicate key");
  e.code = 11000;
  e.keyPattern = keyPattern;
  return e;
};

test("retries on farmerIdNumber collision then succeeds", async () => {
  let calls = 0;
  const doc = {
    farmerIdNumber: "AP-KAT-111111",
    save: async function () {
      calls++;
      if (calls === 1) throw dupErr({ farmerIdNumber: 1 });
      return this;
    },
  };
  const res = await saveBeneficiaryWithUniqueId(doc);
  assert.equal(calls, 2);
  assert.strictEqual(res, doc);
  assert.equal(doc.farmerIdNumber, undefined); // cleared so the hook regenerates
});

test("re-throws immediately on a real idNumber conflict (no retry)", async () => {
  let calls = 0;
  const doc = {
    save: async function () {
      calls++;
      throw dupErr({ "identification.idNumber": 1 });
    },
  };
  await assert.rejects(() => saveBeneficiaryWithUniqueId(doc));
  assert.equal(calls, 1);
});

test("gives up after max attempts on a persistent farmerId clash", async () => {
  let calls = 0;
  const doc = {
    save: async function () {
      calls++;
      throw dupErr({ farmerIdNumber: 1 });
    },
  };
  await assert.rejects(() => saveBeneficiaryWithUniqueId(doc, 3));
  assert.equal(calls, 3);
});
