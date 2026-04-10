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


router.use("/auth", authAdminRoute);
router.use("/lead", leadAdminRoute);
router.use("/leads", leadAdminRoute);
router.use("/showrooms", showroomAdminRoute);
router.use("/qr-code", qrcodeAdminRoute);
router.use("/seo-meta", seoMetaAdminRoute);
router.use("/events", eventAdminRoute);
router.use("/blog", blogAdminRoute);
router.use("/product", productAdminRoute);

module.exports = router;
