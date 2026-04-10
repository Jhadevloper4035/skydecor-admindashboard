const express = require("express");
const { getBlogs } = require("../../controller/blog.controller.js");

const router = express.Router();

router.get("/", getBlogs);

module.exports = router;
