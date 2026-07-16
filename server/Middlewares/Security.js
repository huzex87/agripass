const rateLimit = require("express-rate-limit");

// General ceiling for the whole API — generous enough for normal dashboard
// use, low enough to blunt scraping and abuse. Note: the in-memory store is
// per-instance, so on serverless this is best-effort rather than a global cap.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

// Strict limiter for credential endpoints (logins, signups, password reset).
// Successful requests don't count, so legitimate users are never locked out
// by their own activity — only repeated failures are throttled.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Too many attempts. Please try again in 15 minutes." },
});

module.exports = { apiLimiter, authLimiter };
