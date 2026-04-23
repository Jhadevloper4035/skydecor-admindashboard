const Product = require("../model/product.model.js");
const slugify = require("slugify");

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 2000, 2000);
    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .select("-__v")
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments({ isActive: true }),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      success: true,
      currentPage: page,
      totalPages,
      totalProducts,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      productName, productCode, productType, isActive,
      category, subCategory, texture, textureCode,
      size, thickness, width, image, pdfUrlPath, applicationImage,
    } = req.body;

    if (!productName || !productCode || !productType || !category || !subCategory ||
        !texture || !textureCode || !size || !thickness || !width || !image || !pdfUrlPath) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const product = new Product({
      productName,
      productCode,
      productType,
      isActive: isActive !== undefined ? isActive : true,
      category,
      subCategory,
      texture,
      textureCode,
      size,
      thickness,
      width,
      image,
      pdfUrlPath,
      applicationImage: applicationImage ?? [],
    });

    const saved = await product.save();

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message || "An error occurred while creating the product." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName, productCode, productType, isActive,
      category, subCategory, texture, textureCode,
      size, thickness, width, image, pdfUrlPath, applicationImage,
    } = req.body;

    const update = {};
    if (productName      !== undefined) update.productName      = productName;
    if (productCode      !== undefined) update.productCode      = productCode;
    if (productType      !== undefined) update.productType      = productType;
    if (isActive         !== undefined) update.isActive         = isActive;
    if (category         !== undefined) update.category         = category;
    if (subCategory      !== undefined) update.subCategory      = subCategory;
    if (texture          !== undefined) update.texture          = texture;
    if (textureCode      !== undefined) update.textureCode      = textureCode;
    if (size             !== undefined) update.size             = size;
    if (thickness        !== undefined) update.thickness        = thickness;
    if (width            !== undefined) update.width            = width;
    if (image            !== undefined) update.image            = image;
    if (pdfUrlPath       !== undefined) update.pdfUrlPath       = pdfUrlPath;
    if (applicationImage !== undefined) update.applicationImage = applicationImage;

    // Re-generate slug fields when slug-source fields change
    if (update.productCode) {
      update.productCodeSlug = slugify(update.productCode, { lower: true, strict: true });
    }
    if (update.productType) {
      update.productTypeSlug = slugify(update.productType, { lower: true, strict: true });
    }
    if (update.category) {
      update.categorySlug = slugify(update.category, { lower: true, strict: true });
    }

    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({
      status: "success",
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message || "An error occurred while updating the product." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message || "An error occurred while deleting the product." });
  }
};
