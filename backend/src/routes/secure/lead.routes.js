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

//get all leads
router.get("/all-leads", getLeads);

// seed leads from leads.json into DB (run once)
router.get("/seed", seedLeads);



// POST /api/lead/
router.post("/event/contact-form-submit/:place", validateEventForm, submitFormEvent);
router.get("/event/:place", getEventLeads);
router.get("/event/download/:place", downloadEventLeads);

router.post("/showroom/contact-form-submit", validateShowroomForm, submitFormShowroom);
router.get("/showroom", getShowroomLeads);
router.get("/showroom/download", downloadShowroomLeads);
router.get("/contactleads", getEnquiries);
router.post("/contactleads", createEnquiry);
router.put("/contactleads/:id", updateEnquiry);
router.delete("/contactleads/:id", deleteEnquiry);
router.get("/website/download", downloadWebsiteEnquiries);
router.get("/productEnquiry", getProductEnquiries);
router.get("/product-enquiry/download", downloadProductEnquiries);
router.get("/jobapplications", getJobApplications);
router.get("/job-application/download", downloadJobApplications);

module.exports = router;
