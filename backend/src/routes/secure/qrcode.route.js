const express = require("express");
const {
  getQRCodes,
  downloadQRCodes,
  getQRCodeById,
  createQRCode,
  updateQRCode,
  deleteQRCode,
  deleteMultipleQRCodes,
  searchQRCodes,
  getQRCodesByCategory,
  getCategories,
  getProductTypes,
  getQRCodesByProductType,
  updateNanoTouchProToZeroMarkPro
} = require("../../controller/qrcode.controller.js");

const router = express.Router();

// CRUD Operations
router.get("/", getQRCodes);
router.get("/download", downloadQRCodes);
router.get("/search", searchQRCodes);
router.get("/categories", getCategories);
router.get("/product-types", getProductTypes);
router.get("/category/:category", getQRCodesByCategory);
router.get("/:productType", getQRCodesByProductType);
router.get("/id/:id", getQRCodeById);

router.post("/", createQRCode);
router.post("/bulk-delete", deleteMultipleQRCodes);

router.put("/:id", updateQRCode);
router.patch("/:id", updateQRCode);
router.patch("/migrate/:existingProductType/:updatingProductType", updateNanoTouchProToZeroMarkPro);

router.delete("/:id", deleteQRCode);

module.exports = router;
