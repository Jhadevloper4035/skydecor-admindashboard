
const router = require("express").Router();
const { register, login, logout, getMe } = require("../controller/user.controller.js");
const { authLimiter } = require("../middleware/rateLimiter.js");
const { protect } = require("../middleware/jwt.js");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, getMe); 

module.exports = router;
