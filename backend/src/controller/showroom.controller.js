const Showroom = require("../model/showroom.model.js");

exports.getShowrooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2000;
    const skip = (page - 1) * limit;

    const showrooms = await Showroom.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "Showrooms fetched successfully",
      data: showrooms,
    });
  } catch (error) {
    console.error("Error fetching showrooms:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching showrooms." });
  }
};
