const {
  Beneficiary,
  Organization,
  Admin,
  User,
} = require("../Database_Models/Models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  storeRefreshToken,
  getRefreshTokenUserId,
  deleteRefreshToken,
  deleteAllUserTokens,
} = require("./Utils/redisFn");
const { generateRefreshToken } = require("./Utils/tokenUtils");

//"Functions should be like paragraphs—each one tells a single part of the story, and together they make sense."

const loginBeneficiary = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await Beneficiary.findOne({ "personalDetails.email": email });
    if (!user) {
      return res
        .status(400)
        .json({ error: `No account found with this email ${email}` });
    }
    const isMatch = await bcrypt.compare(
      password,
      user.personalDetails.password
    );
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (user.status === "suspended") {
      const currentDate = new Date();
      if (user.suspendedUntil && currentDate > user.suspendedUntil) {
        user.status = "approved";
        user.suspendedUntil = null;
        await user.save();
      } else {
        return res.status(400).json({
          error: "User is suspended ",
          suspendedUntil: user.suspendedUntil,
        });
      }
    }

    const payload = {
      id: user._id,
      role: "beneficiary",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//Login an organization or cooperative admin user
const loginOrganization = async (req, res) => {
  const { subdomain, email, password } = req.body;

  if ((!subdomain && !email) || !password) {
    return res.status(400).json({ error: "Credentials and password are required" });
  }

  try {
    let organization;
    let userRecord;

    if (email) {
      // Multi-user cooperative staff live in the User collection, while a
      // self-registered single-account cooperative stores its credentials
      // directly on the Organization document. Try the staff account first,
      // then fall back to the organization's own email/password.
      userRecord = await User.findOne({ email });
      if (userRecord) {
        const isMatch = await bcrypt.compare(password, userRecord.password);
        if (!isMatch) {
          return res.status(400).json({ error: "Invalid credentials" });
        }

        organization = await Organization.findById(userRecord.organizationId);
        if (!organization) {
          return res.status(400).json({ error: "Associated cooperative organization not found" });
        }
      } else {
        organization = await Organization.findOne({ email });
        if (!organization) {
          return res.status(400).json({ error: "No account found with this email" });
        }

        const isMatch = await bcrypt.compare(password, organization.password);
        if (!isMatch) {
          return res.status(400).json({ error: "Invalid credentials" });
        }
      }
    } else {
      // Fallback to subdomain lookups
      organization = await Organization.findOne({ subdomain });
      if (!organization) {
        return res
          .status(400)
          .json({ error: "No account found with this subdomain" });
      }

      const isMatch = await bcrypt.compare(password, organization.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid password or credentials" });
      }
    }

    const payload = {
      id: organization._id,
      role: "organization",
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    const refreshToken = generateRefreshToken();
    await storeRefreshToken(refreshToken, organization._id.toString());

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      organizationName: organization.name,
      subdomain: organization.subdomain,
    });
  } catch (error) {
    let errorMessage = "Server Error";
    if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ error: "No account found with this email" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = {
      id: admin._id,
      email: admin.email,
      role: "admin",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Admin login successful",
      token,
      adminName: admin.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const refreshTokenHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    const userId = await getRefreshTokenUserId(refreshToken);
    if (!userId) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const organization = await Organization.findById(userId);
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    const payload = {
      id: organization._id,
      role: "organization",
    };
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    const newRefreshToken = generateRefreshToken();
    await storeRefreshToken(newRefreshToken, organization._id.toString());
    await deleteRefreshToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });
    res.status(200).json({
      accessToken: newToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const logoutHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ error: "No refresh token provided" });
  }
  try {
    await deleteRefreshToken(refreshToken);
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const logoutAllHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const userId = await getRefreshTokenUserId(refreshToken);
      if (userId) {
        await deleteAllUserTokens(userId);
      }
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out from all devices" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  loginBeneficiary,
  loginOrganization,
  loginAdmin,
  refreshTokenHandler,
  logoutHandler,
  logoutAllHandler,
};
