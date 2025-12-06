const express = require("express");
const router = express.Router();
const Quiz = require("../controllers/quizController");

router.post("/generate", Quiz.generateQuiz);
router.post("/submit", Quiz.submitQuiz);
router.get("/history", Quiz.getHistory);

module.exports = router;
