const Lead = require("../model/lead.model.js");
const {
  MAX_DOWNLOAD_LIMIT,
  formatProductType,
  sendExcelDownload,
} = require("../utils/excel.js");



const getPagination = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(
    Math.max(1, parseInt(req.query.limit) || 200),
    MAX_DOWNLOAD_LIMIT
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const fetchLeads = async (filter, { skip, limit }) => {
  const total = await Lead.countDocuments(filter);

  const leads = await Lead.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return { total, leads };
};


const exportLeadsToExcel = async (res, filter) => {
  const data = await Lead.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const cleanData = data
    .map(formatProductType)
    .map(({ _id, __v, ...rest }) => rest);

  sendExcelDownload(res, cleanData);
};



module.exports.submitFormEvent = async (req, res) => {
  try {
    const { mobileNumber, ...rest } = req.body;
    const { place } = req.params;

    const existingLead = await Lead.findOne({
      mobileNumber,
      place,
      leadType: "event",
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        status: "already_submitted",
        message: "You have already registered for this event.",
      });
    }

    const lead = await Lead.create({
      ...rest,
      mobileNumber,
      place,
      leadType: "event",
    });

    return res.status(201).json({
      success: true,
      status: "submitted",
      message: "Thank you! Your registration was successful.",
      data: { id: lead._id },
    });
  } catch (error) {
    console.error("Event form submission error:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Error submitting form. Please try again.",
    });
  }
};


module.exports.getEventLeads = async (req, res) => {
  try {
    const { place } = req.params;
    const { page, limit, skip } = getPagination(req);

    const { total, leads } = await fetchLeads(
      { leadType: "event", place },
      { skip, limit }
    );

    return res.status(200).json({
      success: true,
      status: "ok",
      count: leads.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: leads.map(formatProductType),
    });
  } catch (error) {
    console.error("Event leads error:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error",
    });
  }
};

/**
 * EVENT: Download Excel
 */
module.exports.downloadEventLeads = async (req, res) => {
  try {
    const { place } = req.params;
    await exportLeadsToExcel(res, { leadType: "event", place });
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Error generating Excel file",
    });
  }
};

/**
 * SHOWROOM: Submit Form
 */
module.exports.submitFormShowroom = async (req, res) => {
  try {
    const { mobileNumber, ...rest } = req.body;

    const existingLead = await Lead.findOne({
      mobileNumber,
      leadType: "showroom",
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        status: "already_submitted",
        message: "You have already submitted a showroom enquiry.",
      });
    }

    const lead = await Lead.create({
      ...rest,
      mobileNumber,
      leadType: "showroom",
      place: rest.place || "kirti nagar", 
    });

    return res.status(201).json({
      success: true,
      status: "submitted",
      message: "Thank you! Your showroom enquiry was submitted successfully.",
      data: { id: lead._id },
    });
  } catch (error) {
    console.error("Showroom form submission error:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Error submitting form. Please try again.",
    });
  }
};

/**
 * SHOWROOM: Get Leads
 */
module.exports.getShowroomLeads = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const { total, leads } = await fetchLeads(
      { leadType: "showroom" },
      { skip, limit }
    );

    return res.status(200).json({
      success: true,
      status: "ok",
      count: leads.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: leads.map(formatProductType),
    });
  } catch (error) {
    console.error("Showroom leads error:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error",
    });
  }
};

/**
 * SHOWROOM: Download Excel
 */
module.exports.downloadShowroomLeads = async (req, res) => {
  try {
    await exportLeadsToExcel(res, { leadType: "showroom" });
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Error generating Excel file",
    });
  }
};