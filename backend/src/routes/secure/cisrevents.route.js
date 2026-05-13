const express = require("express");
const {
  getCisrEvents,
  createCisrEvent,
  updateCisrEvent,
  deleteCisrEvent,
} = require("../../controller/cisrevents.controller.js");

const router = express.Router();

router.get("/", getCisrEvents);
router.post("/", createCisrEvent);
router.put("/:id", updateCisrEvent);
router.delete("/:id", deleteCisrEvent);

module.exports = router;
