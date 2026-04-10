const express = require("express");
const { getProducts } = require("../../controller/products.controller.js");

const router = express.Router();

router.get("/", getProducts);

module.exports = router;
