
const express = require("express");
const router = express.Router();
const learningController= require("../controllers/learningController");

router.post("/learningplan", learningController.generateStudyPlan);

module.exports = router;
