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
const leadsAccess = [protect, requireRole("admin", "superadmin", "event")];
const salesAccess = [protect, requireRole("admin", "superadmin", "sales")];

// ── Public routes (website form submissions — no auth) ────────────────────────
router.post("/event/contact-form-submit/:place", validateEventForm, submitFormEvent);
router.post("/showroom/contact-form-submit", validateShowroomForm, submitFormShowroom);
router.post("/contactleads", createEnquiry);

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.get("/all-leads", adminOnly, getLeads);
router.get("/seed", adminOnly, seedLeads);

router.get("/event/:place", leadsAccess, getEventLeads);
router.get("/event/download/:place", leadsAccess, downloadEventLeads);

router.get("/showroom", leadsAccess, getShowroomLeads);
router.get("/showroom/download", leadsAccess, downloadShowroomLeads);

router.get("/contactleads", salesAccess, getEnquiries);
router.put("/contactleads/:id", adminOnly, updateEnquiry);
router.delete("/contactleads/:id", adminOnly, deleteEnquiry);
router.get("/website/download", salesAccess, downloadWebsiteEnquiries);

router.get("/productEnquiry", salesAccess, getProductEnquiries);
router.get("/product-enquiry/download", salesAccess, downloadProductEnquiries);

router.get("/jobapplications", salesAccess, getJobApplications);
router.get("/job-application/download", salesAccess, downloadJobApplications);

module.exports = router;
