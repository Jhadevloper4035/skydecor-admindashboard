const express = require("express");
const router = express.Router();

const productAdminRoute = require("./secure/product.route.js");
const blogAdminRoute = require("./secure/blog.route.js");
const eventAdminRoute = require("./secure/events.route.js");
const seoMetaAdminRoute = require("./secure/seo-meta.route.js");
const qrcodeAdminRoute = require("./secure/qrcode.route.js");
const showroomAdminRoute = require("./secure/showroom.route.js");

const leadAdminRoute = require("./secure/lead.routes.js");
const authAdminRoute = require("./auth.routes.js");

const uploadRoute = require("./upload.route.js");
const healthRoute = require("./health.route.js");

const { protect, requireRole } = require("../middleware/jwt.js");

const adminOnly = [protect, requireRole("admin", "superadmin")];

// Public routes — no auth required
router.use("/health", healthRoute);
router.use("/auth", authAdminRoute);

// Lead routes handle their own auth (some endpoints are public form submissions)
router.use("/lead", leadAdminRoute);
router.use("/leads", leadAdminRoute);

// Protected routes — admin or superadmin only
router.use("/upload", adminOnly, uploadRoute);
router.use("/showrooms", adminOnly, showroomAdminRoute);
router.use("/qr-code", adminOnly, qrcodeAdminRoute);
router.use("/seo-meta", adminOnly, seoMetaAdminRoute);
router.use("/events", adminOnly, eventAdminRoute);
router.use("/blog", adminOnly, blogAdminRoute);
router.use("/product", adminOnly, productAdminRoute);

module.exports = router;
