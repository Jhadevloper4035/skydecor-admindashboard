const express = require("express");
const { getQRCodes } = require("../../controller/qrcode.controller.js");

const router = express.Router();

router.get("/", getQRCodes);

module.exports = router;
