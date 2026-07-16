const express = require("express");
const connectDB = require("./Config/Database");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const errorHandler = require("./Middlewares/ErrorHandler");
const { apiLimiter } = require("./Middlewares/Security");
const { isOriginAllowed, buildCorsConfig } = require("./utils/corsPolicy");
const { initOverdueScheduler } = require("./utils/OverdueScheduler");

const PORT = process.env.PORT || 3002;
const app = express();

// Behind Vercel's proxy — required for rate limiting to see real client IPs.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cookieParser());
connectDB();

// CORS is pinned to known origins. Extra production domains go in
// ALLOWED_ORIGINS (comma-separated). Vercel preview deployments are allowed
// only for this project's own Vercel scope — never all of *.vercel.app.
const corsConfig = buildCorsConfig();

app.use(
  cors({
    origin: function (origin, callback) {
      if (isOriginAllowed(origin, corsConfig)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
// 5mb ceiling: beneficiary signup can carry a base64 camera capture.
app.use(express.json({ limit: "5mb" }));
// Strip $/. keys from body, query, and params to block NoSQL operator injection.
app.use(mongoSanitize());

//API Routes
app.use("/api/v1", apiLimiter, [require("./API_Routes/Routes")]);

// Centralized Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initOverdueScheduler();
});

module.exports = app;
