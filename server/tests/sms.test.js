const { test } = require("node:test");
const assert = require("node:assert");
const { normalizePhone, sendSMS } = require("../utils/sms");

test("normalizePhone converts local NG numbers to international", () => {
  assert.equal(normalizePhone("08031234567"), "2348031234567");
  assert.equal(normalizePhone("0803 123 4567"), "2348031234567");
});

test("normalizePhone keeps already-international numbers", () => {
  assert.equal(normalizePhone("+2348031234567"), "2348031234567");
  assert.equal(normalizePhone("2348031234567"), "2348031234567");
});

test("normalizePhone returns null for empty input", () => {
  assert.equal(normalizePhone(""), null);
  assert.equal(normalizePhone(null), null);
});

test("sendSMS is a safe no-op when TERMII_API_KEY is unset", async () => {
  const prev = process.env.TERMII_API_KEY;
  delete process.env.TERMII_API_KEY;
  const res = await sendSMS("08031234567", "hello");
  assert.equal(res.skipped, true);
  if (prev !== undefined) process.env.TERMII_API_KEY = prev;
});
