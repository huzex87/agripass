const mongoose = require("mongoose");
const connectionMap = new Map();

// Helper to resolve tenant database URI
const getTenantUri = (subdomain) => {
  const baseUri = process.env.MONGODB_URL || "mongodb://localhost:27017/agripass";
  const urlParts = baseUri.split("/");
  // Extract database name (removing query parameters if any)
  const dbPart = urlParts[urlParts.length - 1];
  const dbName = dbPart.split("?")[0] || "agripass";
  
  const tenantDbName = `${dbName}_${subdomain}`;
  // Replace base DB name with tenant DB name
  return baseUri.replace(dbName, tenantDbName);
};

// Spawn or retrieve connection handle
const getTenantConnection = (subdomain) => {
  if (connectionMap.has(subdomain)) {
    return connectionMap.get(subdomain);
  }

  const tenantUri = getTenantUri(subdomain);
  const connection = mongoose.createConnection(tenantUri);

  connection.on("connected", () => {
    console.log(`[Multi-Tenant] Connected to database for tenant: ${subdomain}`);
  });

  connection.on("error", (err) => {
    console.error(`[Multi-Tenant] Database error for tenant ${subdomain}:`, err);
  });

  connectionMap.set(subdomain, connection);
  return connection;
};

// Retrieve a compiled model on the tenant connection pool
const getTenantModel = (subdomain, modelName) => {
  const connection = getTenantConnection(subdomain);
  if (connection.models[modelName]) {
    return connection.models[modelName];
  }

  // Import schemas from Models.js
  const { schemas } = require("../Database_Models/Models");
  const schema = schemas[modelName];
  if (!schema) {
    throw new Error(`Schema for model ${modelName} is not registered in Models.js`);
  }

  return connection.model(modelName, schema);
};

module.exports = {
  getTenantConnection,
  getTenantModel,
};
