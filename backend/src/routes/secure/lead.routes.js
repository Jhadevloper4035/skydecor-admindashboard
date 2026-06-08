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
const { protect, requirePermission } = require("../../middleware/jwt.js");

const allLeadsAccess = [
  protect,
  requirePermission(
    "eventLeads.view",
    "showroomLeads.manage",
    "websiteLeads.manage",
    "productEnquiries.view",
    "jobApplications.view"
  ),
];
const eventLeadsAccess = [protect, requirePermission("eventLeads.view")];
const showroomLeadsAccess = [protect, requirePermission("showroomLeads.manage")];
const websiteLeadsAccess = [protect, requirePermission("websiteLeads.manage")];
const productEnquiryAccess = [protect, requirePermission("productEnquiries.view")];
const jobApplicationAccess = [protect, requirePermission("jobApplications.view")];

// ── Public routes (website form submissions — no auth) ────────────────────────
router.post("/event/contact-form-submit/:place", validateEventForm, submitFormEvent);
router.post("/showroom/contact-form-submit", validateShowroomForm, submitFormShowroom);
router.post("/contactleads", createEnquiry);

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.get("/all-leads", allLeadsAccess, getLeads);
router.get("/seed", protect, requirePermission("eventLeads.view"), seedLeads);

router.get("/event/:place", eventLeadsAccess, getEventLeads);
router.get("/event/download/:place", eventLeadsAccess, downloadEventLeads);

router.get("/showroom", showroomLeadsAccess, getShowroomLeads);
router.get("/showroom/download", showroomLeadsAccess, downloadShowroomLeads);

router.get("/contactleads", websiteLeadsAccess, getEnquiries);
router.put("/contactleads/:id", websiteLeadsAccess, updateEnquiry);
router.delete("/contactleads/:id", websiteLeadsAccess, deleteEnquiry);
router.get("/website/download", websiteLeadsAccess, downloadWebsiteEnquiries);

router.get("/productEnquiry", productEnquiryAccess, getProductEnquiries);
router.get("/product-enquiry/download", productEnquiryAccess, downloadProductEnquiries);

router.get("/jobapplications", jobApplicationAccess, getJobApplications);
router.get("/job-application/download", jobApplicationAccess, downloadJobApplications);

module.exports = router;
