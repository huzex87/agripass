const { getTenantConnection, getTenantModel } = require("../Config/tenantConnection");

const tenantDatabaseMiddleware = (req, res, next) => {
  // Extract subdomain via x-subdomain header or hostname prefix
  const subdomain = req.headers["x-subdomain"] || req.hostname.split(".")[0];

  // Exclude system landing pages or default domains from tenant isolation
  if (!subdomain || subdomain === "localhost" || subdomain === "www" || subdomain === "admin") {
    return next();
  }

  try {
    // Attach connection pool handle to express request object
    req.tenantDb = getTenantConnection(subdomain);
    
    // Attach helper to load compiled tenant-specific model dynamically
    req.getTenantModel = (modelName) => getTenantModel(subdomain, modelName);
    
    next();
  } catch (error) {
    console.error(`[Multi-Tenant] Connection routing failed for subdomain "${subdomain}":`, error);
    res.status(500).json({ error: "Failed to route database to organization tenant." });
  }
};

module.exports = tenantDatabaseMiddleware;
