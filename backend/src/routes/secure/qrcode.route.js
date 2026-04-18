const express = require("express");
const { getQRCodes, getQRCodesByProductType, getQRCodesZeroMarkPro, updateNanoTouchProToZeroMarkPro } = require("../../controller/qrcode.controller.js");

const router = express.Router();

router.get("/", getQRCodes);
router.get("/:productType", getQRCodesByProductType);
router.patch("/migrate/:existingProductType/:updatingProductType", updateNanoTouchProToZeroMarkPro);

module.exports = router;
