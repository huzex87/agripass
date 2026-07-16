const { test } = require("node:test");
const assert = require("node:assert");
const { isLocationAllowed } = require("../Controllers/Clients/CollectorController");

const ward = [{ state: "Katsina", lga: "Batagarawa", ward: "Ajiwa" }];
const lga = [{ state: "Katsina", lga: "Batagarawa" }];
const state = [{ state: "Katsina" }];

test("ward-level: exact match (case/space insensitive) allowed", () => {
  assert.equal(isLocationAllowed(ward, { state: "Katsina", lga: "Batagarawa", ward: "Ajiwa" }), true);
  assert.equal(isLocationAllowed(ward, { state: " katsina ", lga: " batagarawa ", ward: " ajiwa " }), true);
});

test("ward-level: wrong ward or lga rejected", () => {
  assert.equal(isLocationAllowed(ward, { state: "Katsina", lga: "Batagarawa", ward: "Other" }), false);
  assert.equal(isLocationAllowed(ward, { state: "Katsina", lga: "Rimi", ward: "Ajiwa" }), false);
});

test("lga-level: covers any ward in the lga; rejects other lgas", () => {
  assert.equal(isLocationAllowed(lga, { state: "Katsina", lga: "Batagarawa", ward: "Anything" }), true);
  assert.equal(isLocationAllowed(lga, { state: "Katsina", lga: "Daura", ward: "X" }), false);
});

test("state-level: covers whole state; rejects other states", () => {
  assert.equal(isLocationAllowed(state, { state: "Katsina", lga: "Daura", ward: "Z" }), true);
  assert.equal(isLocationAllowed(state, { state: "Kano", lga: "X" }), false);
});

test("edge cases: empty/null assignments and null location are all false", () => {
  assert.equal(isLocationAllowed([], { state: "Katsina" }), false);
  assert.equal(isLocationAllowed(null, { state: "Katsina" }), false);
  assert.equal(isLocationAllowed(state, null), false);
});

test("multi-area: matches when any assigned area matches", () => {
  assert.equal(
    isLocationAllowed([{ state: "Kano" }, { state: "Katsina" }], { state: "Katsina", lga: "Rimi" }),
    true
  );
});
