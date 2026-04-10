const Product = require("../model/product.model.js");

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
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};
