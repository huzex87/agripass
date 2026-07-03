const express = require("express");
const connectDB = require("./Config/Database");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./Middlewares/ErrorHandler");
const tenantDatabaseMiddleware = require("./Middlewares/TenantDatabase");
const { initOverdueScheduler } = require("./utils/OverdueScheduler");

PORT = process.env.PORT || 3002;
const app = express();

app.use(cookieParser());
connectDB();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-subdomain",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  })
);
app.use(express.json());

//API Routes
app.use(tenantDatabaseMiddleware);
app.use("/api/v1", [require("./API_Routes/Routes")]);

// Centralized Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initOverdueScheduler();
});

module.exports = app;
