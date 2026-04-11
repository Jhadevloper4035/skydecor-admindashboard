const Event = require("../model/event.model.js");
const slugify = require("slugify");

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
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { id, title, slug, date, coverImage, images } = req.body;

    if (!title || !date || !coverImage) {
      return res.status(400).json({ error: "Title, date, and coverImage are required." });
    }

    const galleryImages = Array.isArray(images) ? images.filter(Boolean) : [];
    if (galleryImages.length === 0) {
      return res.status(400).json({ error: "At least one gallery image is required." });
    }

    const event = new Event({
      id,
      title,
      slug: slug || slugify(title, { lower: true, strict: true }),
      date,
      coverImage,
      images: galleryImages,
    });

    const saved = await event.save();

    res.status(201).json({
      status: "success",
      message: "Event created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: error.message || "An error occurred while creating the event." });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, date, coverImage, images } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (slug !== undefined) update.slug = slug;
    if (date !== undefined) update.date = date;
    if (coverImage !== undefined) update.coverImage = coverImage;
    if (images !== undefined) update.images = Array.isArray(images) ? images.filter(Boolean) : [];

    const updated = await Event.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json({
      status: "success",
      message: "Event updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: error.message || "An error occurred while updating the event." });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json({ status: "success", message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: error.message || "An error occurred while deleting the event." });
  }
};
