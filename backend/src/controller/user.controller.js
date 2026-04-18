const User = require("../model/user.model.js");
const { generateToken } = require("../middleware/jwt.js");

const VALID_ACCESS_TYPES = ["event", "admin", "showroom", "website", "superadmin", "sales"];

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day — matches JWT expiry
  };
}

// POST /api/user/register
exports.register = async (req, res) => {
  const { name, password, accessType } = req.body;

  if (!name || !password) {
    return res.status(400).json({
      success: false,
      status: "validation_error",
      message: "Name and password are required.",
    });
  }

  if (accessType && !VALID_ACCESS_TYPES.includes(accessType)) {
    return res.status(400).json({
      success: false,
      status: "validation_error",
      message: `Invalid access type. Must be one of: ${VALID_ACCESS_TYPES.join(", ")}`,
    });
  }

  try {
    const userExists = await User.findOne({ name });
    if (userExists) {
      return res.status(400).json({
        success: false,
        status: "user_exists",
        message: "User already exists.",
      });
    }

    const user = await User.create({ name, password, accessType });
    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions());

    return res.status(201).json({
      success: true,
      status: "registered",
      message: "Registration successful.",
      data: {
        user: { id: user._id, name: user.name, accessType: user.accessType },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Registration failed. Please try again.",
    });
  }
};

// POST /api/user/login
exports.login = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({
      success: false,
      status: "validation_error",
      message: "Name and password are required.",
    });
  }

  try {
    const user = await User.findOne({ name });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.cookie("token", token, cookieOptions());

      return res.status(200).json({
        success: true,
        status: "logged_in",
        message: "Login successful.",
        data: {
          user: { id: user._id, name: user.name, accessType: user.accessType },
        },
      });
    }

    return res.status(401).json({
      success: false,
      status: "invalid_credentials",
      message: "Invalid name or password.",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Login failed. Please try again.",
    });
  }
};

// POST /api/user/logout
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });
  return res.status(200).json({
    success: true,
    status: "logged_out",
    message: "Logged out successfully.",
  });
};

// GET /api/user/me  — returns logged-in user info (React can call on mount)
exports.getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    status: "ok",
    data: {
      user: { id: req.user._id, name: req.user.name, accessType: req.user.accessType },
    },
  });
};

// GET /api/auth/users — superadmin: list all users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.error("List users error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};

// PUT /api/auth/users/:id — superadmin: update name, accessType, or password
exports.updateUser = async (req, res) => {
  const { name, accessType, password } = req.body;

  if (accessType && !VALID_ACCESS_TYPES.includes(accessType)) {
    return res.status(400).json({
      success: false,
      message: `Invalid access type. Must be one of: ${VALID_ACCESS_TYPES.join(", ")}`,
    });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (name) user.name = name;
    if (accessType) user.accessType = accessType;
    if (password) user.password = password;

    await user.save();

    return res.status(200).json({
      success: true,
      status: "updated",
      data: { user: { id: user._id, name: user.name, accessType: user.accessType } },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ success: false, message: "Failed to update user." });
  }
};

// DELETE /api/auth/users/:id — superadmin: delete a user (cannot delete self)
exports.deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: "You cannot delete your own account." });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, status: "deleted", message: "User deleted." });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete user." });
  }
};
