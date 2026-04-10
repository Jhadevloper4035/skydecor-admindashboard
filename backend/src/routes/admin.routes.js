const router = require("express").Router();
const Lead = require("../model/lead.model.js");

const {
  protect,
  showroomLeadAccess,
  websiteLeadAccess,
  adminLeadAccess,
} = require("../middleware/jwt.js");
const {
  MAX_DOWNLOAD_LIMIT,
  formatProductType,
  fetchFromExternalAPI,
  sendExcelDownload,
  parsePagination,
} = require("../utils/excel.js");

// ── Dashboard ─────────────────────────────────────────────────────────────────
// GET /api/admin/dashboard
router.get("/dashboard", protect, async (req, res) => {
  try {
    const leads = await Lead.find({ leadType: req.user.accessType })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      status: "ok",
      data: {
        user: { id: req.user._id, name: req.user.name, accessType: req.user.accessType },
        leads: leads.map(formatProductType),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ success: false, status: "error", message: "Internal server error" });
  }
});

// ── Event leads ───────────────────────────────────────────────────────────────
// GET /api/admin/event/:place
router.get("/event/:place", protect, adminLeadAccess, async (req, res) => {
  try {
    const { place } = req.params;
    const leads = await Lead.find({ leadType: "event", place })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      status: "ok",
      data: { leads: leads.map(formatProductType), place },
    });
  } catch (error) {
    console.error("Event leads error:", error);
    return res.status(500).json({ success: false, status: "error", message: "Internal server error" });
  }
});

// GET /api/admin/event/download/:place  — Excel download (unchanged)
router.get("/event/download/:place", protect, adminLeadAccess, async (req, res) => {
  try {
    const { place } = req.params;
    const data = await Lead.find({ leadType: "event", place }).sort({ createdAt: -1 }).lean();
    const cleanData = data.map(formatProductType).map(({ _id, __v, ...rest }) => rest);
    sendExcelDownload(res, cleanData);
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ success: false, status: "error", message: "Error generating Excel file" });
  }
});

// ── Showroom leads ────────────────────────────────────────────────────────────
// GET /api/admin/showroom

router.get("/showroom", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), MAX_DOWNLOAD_LIMIT);

    const skip = (page - 1) * limit;

    // Total count (for frontend pagination)
    const total = await Lead.countDocuments({ leadType: "showroom" });

    // Paginated data
    const leads = await Lead.find({ leadType: "showroom" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      status: "ok",
      count: leads.length,
      total,              // total records
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: leads.map(formatProductType),
    });

  } catch (error) {
    console.error("Showroom leads error:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});


// GET /api/admin/showroom/download
router.get("/showroom/download", protect, showroomLeadAccess, async (req, res) => {
  try {
    const data = await Lead.find({ leadType: "showroom" }).sort({ createdAt: -1 }).lean();
    const cleanData = data.map(formatProductType).map(({ _id, __v, ...rest }) => rest);
    sendExcelDownload(res, cleanData);
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ success: false, status: "error", message: "Error generating Excel file" });
  }
});







// ── Website: Product enquiry ──────────────────────────────────────────────────
// GET /api/admin/website/product/enquiry
router.get("/website/product/enquiry", protect, websiteLeadAccess, async (req, res) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const leads = await fetchFromExternalAPI("/api/lead/productEnquiry", page, limit);

    return res.status(200).json({
      success: true,
      status: "ok",
      data: leads.data,
    });
  } catch (error) {
    console.error("Product enquiry error:", error);
    return res.status(500).json({ success: false, status: "error", message: error.message });
  }
});

// GET /api/admin/website/product/enquiry/download
router.get("/website/product/enquiry/download", protect, websiteLeadAccess, async (req, res) => {
  try {
    const leadData = await fetchFromExternalAPI("/api/lead/productEnquiry", 1, MAX_DOWNLOAD_LIMIT);
    const cleanData = leadData.data.map(({ _id, __v, ...item }) => ({
      ...item,
      note: Array.isArray(item.note) ? item.note.join(", ") : item.note,
    }));
    sendExcelDownload(res, cleanData);
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ success: false, status: "error", message: "Error generating Excel file" });
  }
});

// ── Website: Contact enquiry ──────────────────────────────────────────────────
// GET /api/admin/website/contact/enquiry
router.get("/website/contact/enquiry", protect, websiteLeadAccess, async (req, res) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const leads = await fetchFromExternalAPI("/api/lead/contactleads", page, limit);

    return res.status(200).json({
      success: true,
      status: "ok",
      data: leads.data,
    });
  } catch (error) {
    console.error("Contact enquiry error:", error);
    return res.status(500).json({ success: false, status: "error", message: error.message });
  }
});

// GET /api/admin/website/contact/enquiry/download
router.get("/website/contact/enquiry/download", protect, websiteLeadAccess, async (req, res) => {
  try {
    const leadData = await fetchFromExternalAPI("/api/lead/contactleads", 1, MAX_DOWNLOAD_LIMIT);
    const cleanData = leadData.data.map(({ _id, __v, ...item }) => ({
      ...item,
      note: Array.isArray(item.note) ? item.note.join(", ") : item.note,
    }));
    sendExcelDownload(res, cleanData);
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ success: false, status: "error", message: "Error generating Excel file" });
  }
});

// ── Website: Job applications ─────────────────────────────────────────────────
// GET /api/admin/website/jobapplication/enquiry
router.get("/website/jobapplication/enquiry", protect, websiteLeadAccess, async (req, res) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const leads = await fetchFromExternalAPI("/api/lead/jobapplications", page, limit);

    return res.status(200).json({
      success: true,
      status: "ok",
      data: leads.data,
    });
  } catch (error) {
    console.error("Job applications error:", error);
    return res.status(500).json({ success: false, status: "error", message: error.message });
  }
});

// GET /api/admin/website/jobapplication/enquiry/download
router.get("/website/jobapplication/enquiry/download", protect, websiteLeadAccess, async (req, res) => {
  try {
    const leadData = await fetchFromExternalAPI("/api/lead/jobapplications", 1, MAX_DOWNLOAD_LIMIT);
    const cleanData = leadData.data.map((item) => ({
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      city: item.city,
      position: item.position,
      experience: item.experience,
      qualification: item.qualification,
      currentCompany: item.currentCompany,
      coverLetter: item.coverLetter,
      consent: item.consent,
      status: item.status,
      resumeFileName: item.resume?.filename
        ? `${process.env.API_ENDPOINT}/uploads/resumes/${item.resume.filename}`
        : null,
      jobTitle: item.jobId?.title || null,
      jobLocation: item.jobId?.location || null,
      jobDepartment: item.jobId?.department || null,
      submittedAt: item.submittedAt,
    }));
    sendExcelDownload(res, cleanData);
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ success: false, status: "error", message: "Error generating Excel file" });
  }
});

// ── Lead lookup / update by phone ─────────────────────────────────────────────
// GET /api/admin/event/phone/:phone
router.get("/event/phone/:phone", protect, adminLeadAccess, async (req, res) => {
  try {
    const lead = await Lead.findOne({ mobileNumber: req.params.phone });
    if (!lead) {
      return res.status(404).json({ success: false, status: "not_found", message: "Lead not found" });
    }
    return res.status(200).json({ success: true, status: "ok", data: lead });
  } catch (error) {
    console.error("Find lead error:", error);
    return res.status(500).json({ success: false, status: "error", message: "Internal server error" });
  }
});

// PUT /api/admin/event/phone/:phone
router.put("/event/phone/:phone", protect, adminLeadAccess, async (req, res) => {
  try {
    const lead = await Lead.findOne({ mobileNumber: req.params.phone });
    if (!lead) {
      return res.status(404).json({ success: false, status: "not_found", message: "Lead not found" });
    }

    const { leadType, place } = req.body;
    if (leadType) lead.leadType = leadType;
    if (place) lead.place = place;
    await lead.save();

    return res.status(200).json({ success: true, status: "ok", message: "Lead updated successfully", data: lead });
  } catch (error) {
    console.error("Update lead error:", error);
    return res.status(500).json({ success: false, status: "error", message: "Internal server error" });
  }
});

module.exports = router;
