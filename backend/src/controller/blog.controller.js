const Blog = require("../model/blog.model.js");
const slugify = require("slugify");

exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 60;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({})
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "Blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "An error occurred while fetching blogs." });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, image, text, status, meta_name, meta_tags, meta_title, meta_description, author, url } = req.body;

    if (!title || !image || !text) {
      return res.status(400).json({ error: "Title, image, and text are required." });
    }

    const normalizedUrl = url?.trim()
      ? slugify(url, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    const newBlog = new Blog({
      title,
      url: normalizedUrl,
      image,
      text,
      status,
      meta_name,
      meta_tags,
      meta_title,
      meta_description,
      author,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({
      status: "success",
      message: "Blog created successfully",
      data: savedBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: error.message || "An error occurred while creating the blog." });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, image, text, status, meta_name, meta_tags, meta_title, meta_description, author } = req.body;
    const update = { title, image, text, status, meta_name, meta_tags, meta_title, meta_description, author };

    if (url !== undefined || title !== undefined) {
      const slugSource = url?.trim() || title?.trim();
      if (slugSource) {
        update.url = slugify(slugSource, { lower: true, strict: true });
      }
    }

    const updated = await Blog.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Blog not found." });
    }

    res.json({
      status: "success",
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: error.message || "An error occurred while updating the blog." });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Blog not found." });
    }

    res.json({ status: "success", message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: error.message || "An error occurred while deleting the blog." });
  }
};
