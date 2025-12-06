const express = require("express");
const router = express.Router();
const Analytics = require("../controllers/analyticsController");

router.get("/dashboard", Analytics.dashboard);

module.exports = router;
