const router = require("express").Router();
const Lead = require("../model/lead.model.js");

function paginate(query, page, limit) {
  const skip = (page - 1) * limit;
  return query.sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
}

// GET /api/lead/productEnquiry
router.get("/lead/productEnquiry", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 10000);
  const data = await paginate(Lead.find({ leadType: "productEnquiry" }), page, limit);
  res.json({ success: true, status: "ok", data });
});

// GET /api/lead/contactleads
router.get("/lead/contactleads", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 10000);
  const data = await paginate(Lead.find({ leadType: "contact" }), page, limit);
  res.json({ success: true, status: "ok", data });
});

// GET /api/lead/jobapplications
router.get("/lead/jobapplications", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 10000);
  const data = await paginate(Lead.find({ leadType: "jobapplication" }), page, limit);
  res.json({ success: true, status: "ok", data });
});

module.exports = router;
