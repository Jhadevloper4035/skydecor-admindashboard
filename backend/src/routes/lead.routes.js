const router = require("express").Router();

const {
  submitFormEvent,
  submitFormShowroom,
  getEventLeads,
  downloadEventLeads,
  getShowroomLeads,
  downloadShowroomLeads,
} = require("../controller/lead.controller.js");

const { validateEventForm, validateShowroomForm } = require("../middleware/lead.validation.js");

// POST /api/lead/
router.post("/event/contact-form-submit/:place", validateEventForm, submitFormEvent);
router.get("/event/:place", getEventLeads);
router.get("/event/download/:place", downloadEventLeads);

router.post("/showroom/contact-form-submit", validateShowroomForm, submitFormShowroom);
router.get("/showroom", getShowroomLeads);
router.get("/showroom/download", downloadShowroomLeads);

module.exports = router;

