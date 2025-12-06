const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/tutor", chatController.aiTutor);

module.exports = router;
