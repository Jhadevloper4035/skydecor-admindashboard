const express = require("express");
const { getSeoMetaEntries } = require("../../controller/seo-meta.controller.js");

const router = express.Router();

router.get("/", getSeoMetaEntries);

module.exports = router;
