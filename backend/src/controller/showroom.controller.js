const Showroom = require("../model/showroom.model.js");
const slugify = require("slugify");

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
    res.status(500).json({ error: "An error occurred while fetching showrooms." });
  }
};

exports.createShowroom = async (req, res) => {
  try {
    const { id, title, slug, location, description, mail, contact, date, maplink, address, coverImage, images } = req.body;

    if (!title || !location || !description) {
      return res.status(400).json({ error: "Title, location, and description are required." });
    }

    const galleryImages = Array.isArray(images) ? images.filter(Boolean) : [];
    if (galleryImages.length === 0) {
      return res.status(400).json({ error: "At least one gallery image is required." });
    }

    const showroom = new Showroom({
      id,
      title,
      slug: slug || slugify(title, { lower: true, strict: true }),
      location,
      description,
      mail,
      contact,
      date,
      maplink,
      address,
      coverImage,
      images: galleryImages,
    });

    const saved = await showroom.save();

    res.status(201).json({
      status: "success",
      message: "Showroom created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating showroom:", error);
    res.status(500).json({ error: error.message || "An error occurred while creating the showroom." });
  }
};

exports.updateShowroom = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, location, description, mail, contact, date, maplink, address, coverImage, images } = req.body;

    const update = {};
    if (title       !== undefined) update.title       = title;
    if (slug        !== undefined) update.slug        = slug;
    if (location    !== undefined) update.location    = location;
    if (description !== undefined) update.description = description;
    if (mail        !== undefined) update.mail        = mail;
    if (contact     !== undefined) update.contact     = contact;
    if (date        !== undefined) update.date        = date;
    if (maplink     !== undefined) update.maplink     = maplink;
    if (address     !== undefined) update.address     = address;
    if (coverImage  !== undefined) update.coverImage  = coverImage;
    if (images      !== undefined) update.images      = Array.isArray(images) ? images.filter(Boolean) : [];

    const updated = await Showroom.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Showroom not found." });
    }

    res.json({
      status: "success",
      message: "Showroom updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating showroom:", error);
    res.status(500).json({ error: error.message || "An error occurred while updating the showroom." });
  }
};

exports.deleteShowroom = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Showroom.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Showroom not found." });
    }

    res.json({ status: "success", message: "Showroom deleted successfully" });
  } catch (error) {
    console.error("Error deleting showroom:", error);
    res.status(500).json({ error: error.message || "An error occurred while deleting the showroom." });
  }
};
