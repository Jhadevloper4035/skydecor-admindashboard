const jwt = require("jsonwebtoken");
const User = require("../model/user.model.js");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// ── Auth guard ────────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      status: "unauthenticated",
      message: "Not authenticated. Please log in.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        status: "unauthenticated",
        message: "User no longer exists.",
      });
    }

    next();
  } catch {
    return res.status(401).json({
      success: false,
      status: "token_invalid",
      message: "Session expired or invalid. Please log in again.",
    });
  }
};

// ── Access-type guards ────────────────────────────────────────────────────────
const websiteLeadAccess = (req, res, next) => {
  if (req.user.accessType === "showroom") {
    return res.status(403).json({
      success: false,
      status: "forbidden",
      message: "Access denied: insufficient permissions.",
    });
  }
  next();
};

const showroomLeadAccess = (req, res, next) => {
  if (req.user.accessType === "website") {
    return res.status(403).json({
      success: false,
      status: "forbidden",
      message: "Access denied: insufficient permissions.",
    });
  }
  next();
};

const adminLeadAccess = (req, res, next) => {
  if (req.user.accessType === "showroom" || req.user.accessType === "website") {
    return res.status(403).json({
      success: false,
      status: "forbidden",
      message: "Access denied: admin or event access required.",
    });
  }
  next();
};

module.exports = {
  generateToken,
  protect,
  websiteLeadAccess,
  showroomLeadAccess,
  adminLeadAccess,
};
