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
