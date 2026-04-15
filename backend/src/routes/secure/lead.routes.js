const router = require("express").Router();

const {
  getLeads,
  seedLeads,
  submitFormEvent,
  submitFormShowroom,
  getEventLeads,
  downloadEventLeads,
  getShowroomLeads,
  downloadShowroomLeads,
  getEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getProductEnquiries,
  downloadWebsiteEnquiries,
  downloadProductEnquiries,
  getJobApplications,
  downloadJobApplications,
} = require("../../controller/lead.controller.js");

const { validateEventForm, validateShowroomForm } = require("../../middleware/lead.validation.js");
const { protect, requireRole } = require("../../middleware/jwt.js");

const adminOnly = [protect, requireRole("admin", "superadmin")];

// ── Public routes (website form submissions — no auth) ────────────────────────
router.post("/event/contact-form-submit/:place", validateEventForm, submitFormEvent);
router.post("/showroom/contact-form-submit", validateShowroomForm, submitFormShowroom);
router.post("/contactleads", createEnquiry);

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.get("/all-leads", adminOnly, getLeads);
router.get("/seed", adminOnly, seedLeads);

router.get("/event/:place", adminOnly, getEventLeads);
router.get("/event/download/:place", adminOnly, downloadEventLeads);

router.get("/showroom", adminOnly, getShowroomLeads);
router.get("/showroom/download", adminOnly, downloadShowroomLeads);

router.get("/contactleads", adminOnly, getEnquiries);
router.put("/contactleads/:id", adminOnly, updateEnquiry);
router.delete("/contactleads/:id", adminOnly, deleteEnquiry);
router.get("/website/download", adminOnly, downloadWebsiteEnquiries);

router.get("/productEnquiry", adminOnly, getProductEnquiries);
router.get("/product-enquiry/download", adminOnly, downloadProductEnquiries);

router.get("/jobapplications", adminOnly, getJobApplications);
router.get("/job-application/download", adminOnly, downloadJobApplications);

module.exports = router;
