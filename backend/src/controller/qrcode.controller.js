const Qrcode = require("../model/qrcode.model.js");

exports.getQRCodes = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2000;
    const skip = (page - 1) * limit;

    const qrcodes = await Qrcode.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "QR codes fetched successfully",
      data: qrcodes,
    });
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching QR codes." });
  }
};
