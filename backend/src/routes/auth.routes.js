
const router = require("express").Router();
const { register, login, logout, getMe, listUsers, updateUser, deleteUser } = require("../controller/user.controller.js");
const { authLimiter } = require("../middleware/rateLimiter.js");
const { protect, requireRole } = require("../middleware/jwt.js");

const superadminOnly = [protect, requireRole("superadmin")];

// Register is admin-only — only a logged-in admin/superadmin can create new users
router.post("/register", protect, requireRole("admin", "superadmin"), register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

// User management — superadmin only
router.get("/users", ...superadminOnly, listUsers);
router.put("/users/:id", ...superadminOnly, updateUser);
router.delete("/users/:id", ...superadminOnly, deleteUser);

module.exports = router;
