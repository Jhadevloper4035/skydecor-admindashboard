
const router = require("express").Router();
const { register, login, logout, getMe } = require("../controller/user.controller.js");
const { authLimiter } = require("../middleware/rateLimiter.js");
const { protect, requireRole } = require("../middleware/jwt.js");

// Register is admin-only — only a logged-in admin/superadmin can create new users
router.post("/register", protect, requireRole("admin", "superadmin"), register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
