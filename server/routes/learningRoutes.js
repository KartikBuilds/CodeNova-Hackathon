const express = require("express");
const router = express.Router();
const Learning = require("../controllers/learningController");

router.post("/plan", Learning.generatePlan);

module.exports = router;
