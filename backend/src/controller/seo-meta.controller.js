const SeoMeta = require("../model/seometa.model.js");

exports.getSeoMetaEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 60;
    const skip = (page - 1) * limit;

    const seoMetaEntries = await SeoMeta.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "SEO Meta entries fetched successfully",
      data: seoMetaEntries,
    });
  } catch (error) {
    console.error("Error fetching SEO Meta:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching SEO Meta." });
  }
};

exports.createSeoMetaEntry = async (req, res) => {
  try {
    const created = await SeoMeta.create(req.body);

    res.status(201).json({
      status: "success",
      message: "SEO Meta entry created successfully",
      data: created,
    });
  } catch (error) {
    console.error("Error creating SEO Meta:", error);
    res.status(500).json({
      error: error.message || "An error occurred while creating SEO Meta.",
    });
  }
};

exports.updateSeoMetaEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await SeoMeta.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "SEO Meta entry not found." });
    }

    res.status(200).json({
      status: "success",
      message: "SEO Meta entry updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating SEO Meta:", error);
    res.status(500).json({
      error: error.message || "An error occurred while updating SEO Meta.",
    });
  }
};

exports.deleteSeoMetaEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SeoMeta.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "SEO Meta entry not found." });
    }

    res.status(200).json({
      status: "success",
      message: "SEO Meta entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting SEO Meta:", error);
    res.status(500).json({
      error: error.message || "An error occurred while deleting SEO Meta.",
    });
  }
};
