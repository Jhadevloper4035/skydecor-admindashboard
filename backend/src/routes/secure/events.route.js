const express = require("express");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../../controller/events.controller.js");
const { requirePermission, requireRole } = require("../../middleware/jwt.js");

const router = express.Router();

router.get("/", requirePermission("events.manage", "eventLeads.view"), getEvents);
router.post("/", requireRole("superadmin"), createEvent);
router.put("/:id", requireRole("superadmin"), updateEvent);
router.delete("/:id", requireRole("superadmin"), deleteEvent);

module.exports = router;
