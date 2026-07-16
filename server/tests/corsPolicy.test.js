const { test } = require("node:test");
const assert = require("node:assert");
const { isOriginAllowed, buildCorsConfig } = require("../utils/corsPolicy");

const cfg = buildCorsConfig({
  ALLOWED_ORIGINS: "https://foo.com,https://bar.org",
  VERCEL_PREVIEW_SUFFIX: "-myproj.vercel.app",
});

test("no origin (same-origin / server-to-server) is allowed", () => {
  assert.equal(isOriginAllowed(undefined, cfg), true);
  assert.equal(isOriginAllowed("", cfg), true);
});

test("localhost and 127.0.0.1 on any port are allowed", () => {
  assert.equal(isOriginAllowed("http://localhost:5173", cfg), true);
  assert.equal(isOriginAllowed("http://127.0.0.1:3000", cfg), true);
});

test("exact prod origins from env are allowed", () => {
  assert.equal(isOriginAllowed("https://foo.com", cfg), true);
  assert.equal(isOriginAllowed("https://bar.org", cfg), true);
});

test("default client domain is allowed", () => {
  assert.equal(isOriginAllowed("https://agripass-client.vercel.app", cfg), true);
});

test("this project's own preview deployments are allowed", () => {
  assert.equal(isOriginAllowed("https://x-git-abc-myproj.vercel.app", cfg), true);
});

test("arbitrary *.vercel.app is REJECTED (the key hardening)", () => {
  assert.equal(isOriginAllowed("https://evil-project.vercel.app", cfg), false);
});

test("random attacker origins are rejected", () => {
  assert.equal(isOriginAllowed("https://attacker.example", cfg), false);
  assert.equal(isOriginAllowed("http://x-myproj.vercel.app", cfg), false); // non-https preview
});
