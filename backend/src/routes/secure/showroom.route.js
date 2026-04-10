const express = require("express");
const { getShowrooms } = require("../../controller/showroom.controller.js");

const router = express.Router();

router.get("/", getShowrooms);

module.exports = router;
