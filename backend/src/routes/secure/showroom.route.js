const express = require("express");
const { getShowrooms, createShowroom, updateShowroom, deleteShowroom } = require("../../controller/showroom.controller.js");

const router = express.Router();

router.get("/", getShowrooms);
router.post("/", createShowroom);
router.put("/:id", updateShowroom);
router.delete("/:id", deleteShowroom);

module.exports = router;
