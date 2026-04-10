const Event = require("../model/event.model.js");

exports.getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching events." });
  }
};
