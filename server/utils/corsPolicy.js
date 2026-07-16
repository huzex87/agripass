// Pure origin-allow decision for CORS, extracted so it can be unit-tested
// without booting the server.
//
// Rules:
//  - No origin (same-origin / curl / server-to-server) is allowed.
//  - localhost / 127.0.0.1 on any port is allowed (local dev).
//  - Exact matches in `allowedOrigins` are allowed (prod domains).
//  - This project's own Vercel preview deployments are allowed via a specific
//    suffix — never all of *.vercel.app.
const isOriginAllowed = (origin, { allowedOrigins = new Set(), previewSuffix = "" } = {}) => {
  if (!origin) return true;
  if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
    return true;
  }
  if (allowedOrigins.has(origin)) return true;
  if (previewSuffix && origin.startsWith("https://") && origin.endsWith(previewSuffix)) {
    return true;
  }
  return false;
};

// Builds the config used to seed the policy from environment variables.
const buildCorsConfig = (env = process.env) => ({
  allowedOrigins: new Set([
    "https://agripass-client.vercel.app",
    ...(env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  ]),
  previewSuffix: env.VERCEL_PREVIEW_SUFFIX || "-huzex87-9264s-projects.vercel.app",
});

module.exports = { isOriginAllowed, buildCorsConfig };
