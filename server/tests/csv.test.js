const { test } = require("node:test");
const assert = require("node:assert");
const { toCSV, escapeField } = require("../utils/csv");

test("escapeField quotes fields with commas, quotes, or newlines", () => {
  assert.equal(escapeField("plain"), "plain");
  assert.equal(escapeField("a,b"), '"a,b"');
  assert.equal(escapeField('say "hi"'), '"say ""hi"""');
  assert.equal(escapeField("line1\nline2"), '"line1\nline2"');
  assert.equal(escapeField(null), "");
  assert.equal(escapeField(undefined), "");
  assert.equal(escapeField(0), "0");
});

test("toCSV builds a BOM-prefixed, CRLF-joined table", () => {
  const csv = toCSV(["Name", "Amount"], [["Musa", 1000], ["Ada, Jr", 2000]]);
  assert.ok(csv.startsWith("﻿"), "should start with UTF-8 BOM");
  const body = csv.slice(1);
  assert.equal(
    body,
    'Name,Amount\r\nMusa,1000\r\n"Ada, Jr",2000'
  );
});

test("toCSV with no rows still emits the header", () => {
  const csv = toCSV(["A", "B"], []);
  assert.equal(csv.slice(1), "A,B");
});
