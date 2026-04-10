const express = require("express");
const { getEvents } = require("../../controller/events.controller.js");

const router = express.Router();

router.get("/", getEvents);

module.exports = router;
