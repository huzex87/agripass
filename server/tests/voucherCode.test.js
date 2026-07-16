const { test } = require("node:test");
const assert = require("node:assert");
const { generateCode } = require("../Controllers/Clients/VoucherController");

test("voucher code matches the VP-XXXX-XXXX format", () => {
  for (let i = 0; i < 200; i++) {
    assert.match(generateCode(), /^VP-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  }
});

test("voucher codes are highly unlikely to collide", () => {
  const seen = new Set();
  for (let i = 0; i < 1000; i++) seen.add(generateCode());
  // 36^8 space — 1000 samples should essentially never collide.
  assert.ok(seen.size > 995, `expected near-unique codes, got ${seen.size}/1000`);
});
