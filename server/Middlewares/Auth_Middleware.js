const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // console.log(`Decoded token: ${decoded}`);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { authMiddleware, adminAuthMiddleware };
