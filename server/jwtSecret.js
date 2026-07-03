const crypto = require("crypto");

//Generate a random string
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString("hex");
  };
  
  const jwtSecret = generateSecretKey();
  console.log(jwtSecret);