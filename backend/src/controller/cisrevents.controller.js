const CisrEvent = require("../model/cisrevent.model.js");
const slugify = require("slugify");

exports.getCisrEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const events = await CisrEvent.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "CISR events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.error("Error fetching CISR events:", error);
    res.status(500).json({ error: "An error occurred while fetching CISR events." });
  }
};

exports.createCisrEvent = async (req, res) => {
  try {
    const { id, title, slug, date, coverImage, images } = req.body;

    if (!id || !title || !date || !coverImage) {
      return res.status(400).json({ error: "CISR Event ID, title, date, and coverImage are required." });
    }

    const eventId = Number(id);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({ error: "CISR Event ID must be a positive number." });
    }

    const galleryImages = Array.isArray(images) ? images.filter(Boolean) : [];
    if (galleryImages.length === 0) {
      return res.status(400).json({ error: "At least one gallery image is required." });
    }

    const event = new CisrEvent({
      id: eventId,
      title,
      slug: slug || slugify(title, { lower: true, strict: true }),
      date,
      coverImage,
      images: galleryImages,
    });

    const saved = await event.save();

    res.status(201).json({
      status: "success",
      message: "CISR event created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating CISR event:", error);
    res.status(500).json({ error: error.message || "An error occurred while creating the CISR event." });
  }
};

exports.updateCisrEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, date, coverImage, images } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (slug !== undefined) update.slug = slug;
    if (date !== undefined) update.date = date;
    if (coverImage !== undefined) update.coverImage = coverImage;
    if (images !== undefined) update.images = Array.isArray(images) ? images.filter(Boolean) : [];

    const updated = await CisrEvent.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "CISR event not found." });
    }

    res.json({
      status: "success",
      message: "CISR event updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating CISR event:", error);
    res.status(500).json({ error: error.message || "An error occurred while updating the CISR event." });
  }
};

exports.deleteCisrEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CisrEvent.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "CISR event not found." });
    }

    res.json({ status: "success", message: "CISR event deleted successfully" });
  } catch (error) {
    console.error("Error deleting CISR event:", error);
    res.status(500).json({ error: error.message || "An error occurred while deleting the CISR event." });
  }
};
