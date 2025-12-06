
const express = require("express");
const router = express.Router();
const quizController=require("../controllers/quizController");

router.post("/generate", quizController.generateQuiz);
router.post("/submit", quizController.submitQuiz);
router.get("/history", quizController.quizHistory);

module.exports = router; 
