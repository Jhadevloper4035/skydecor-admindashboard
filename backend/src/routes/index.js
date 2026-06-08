const express = require("express");
const router = express.Router();

const productAdminRoute = require("./secure/product.route.js");
const blogAdminRoute = require("./secure/blog.route.js");
const eventAdminRoute = require("./secure/events.route.js");
const cisrEventAdminRoute = require("./secure/cisrevents.route.js");
const seoMetaAdminRoute = require("./secure/seo-meta.route.js");
const qrcodeAdminRoute = require("./secure/qrcode.route.js");
const showroomAdminRoute = require("./secure/showroom.route.js");
const jobAdminRoute = require("./secure/job.route.js");

const leadAdminRoute = require("./secure/lead.routes.js");
const authAdminRoute = require("./auth.routes.js");

const uploadRoute = require("./upload.route.js");
const healthRoute = require("./health.route.js");

const { protect, requirePermission } = require("../middleware/jwt.js");

const uploadAccess = [
  protect,
  requirePermission(
    "products.manage",
    "blogs.manage",
    "events.manage",
    "cisrEvents.manage",
    "showrooms.manage",
    "seoMeta.manage",
    "jobs.manage"
  ),
];

// Public routes — no auth required
router.use("/health", healthRoute);
router.use("/auth", authAdminRoute);

// Lead routes handle their own auth (some endpoints are public form submissions)
router.use("/lead", leadAdminRoute);
router.use("/leads", leadAdminRoute);

// Protected routes — admin or superadmin only
router.use("/upload", uploadAccess, uploadRoute);
router.use("/showrooms", protect, requirePermission("showrooms.manage"), showroomAdminRoute);
router.use("/qr-code", protect, requirePermission("qrCodes.manage"), qrcodeAdminRoute);
router.use("/seo-meta", protect, requirePermission("seoMeta.manage"), seoMetaAdminRoute);
router.use("/events", protect, requirePermission("events.manage"), eventAdminRoute);
router.use("/cisr-events", protect, requirePermission("cisrEvents.manage"), cisrEventAdminRoute);
router.use("/blog", protect, requirePermission("blogs.manage"), blogAdminRoute);
router.use("/product", protect, requirePermission("products.manage"), productAdminRoute);
router.use("/jobs", protect, requirePermission("jobs.manage"), jobAdminRoute);

module.exports = router;
