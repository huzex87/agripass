const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Beneficiary, Organization, Admin } = require("../Database_Models/Models");
const {
  storePasswordResetOtp,
  getPasswordResetOtp,
  deletePasswordResetOtp,
  storePasswordResetToken,
  getPasswordResetToken,
  deletePasswordResetToken,
} = require("./Utils/redisFn");

const VALID_ROLES = ["beneficiary", "organization", "admin"];

const findAccountByRole = async (role, email) => {
  if (role === "beneficiary") {
    return Beneficiary.findOne({ "personalDetails.email": email });
  }
  if (role === "organization") {
    return Organization.findOne({ email });
  }
  if (role === "admin") {
    return Admin.findOne({ email });
  }
  return null;
};

// Step 1: request a password reset. Generates a 4-digit OTP and "sends" it by
// logging to the server console, since no email/SMS delivery service is
// configured for this app. Always responds with the same generic message
// regardless of whether the account exists, to avoid leaking which emails
// are registered.
const requestPasswordReset = async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role || !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "A valid email and role are required" });
  }

  const genericResponse = {
    message: "If an account exists for this email, a verification code has been sent.",
  };

  try {
    const account = await findAccountByRole(role, email);
    if (!account) {
      return res.status(200).json(genericResponse);
    }

    const otp = crypto.randomInt(1000, 10000).toString();
    await storePasswordResetOtp(email, { otp, role, userId: account._id.toString() });

    console.log(`[Password Reset] Verification code for ${email} (${role}): ${otp}`);

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Step 2: verify the OTP and issue a short-lived reset token.
const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and verification code are required" });
  }

  try {
    const record = await getPasswordResetOtp(email);
    if (!record || record.otp !== otp) {
      return res.status(400).json({ error: "Invalid or expired verification code" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await storePasswordResetToken(resetToken, { email, role: record.role, userId: record.userId });
    await deletePasswordResetOtp(email);

    return res.status(200).json({ resetToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Step 3: consume the reset token and set the new password.
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: "Reset token and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const record = await getPasswordResetToken(resetToken);
    if (!record) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (record.role === "beneficiary") {
      await Beneficiary.findByIdAndUpdate(record.userId, {
        "personalDetails.password": hashedPassword,
      });
    } else if (record.role === "organization") {
      await Organization.findByIdAndUpdate(record.userId, { password: hashedPassword });
    } else if (record.role === "admin") {
      await Admin.findByIdAndUpdate(record.userId, { password: hashedPassword });
    }

    await deletePasswordResetToken(resetToken);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  requestPasswordReset,
  verifyResetOtp,
  resetPassword,
};
