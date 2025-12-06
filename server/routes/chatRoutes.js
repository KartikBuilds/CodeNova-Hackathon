const express = require("express");
const router = express.Router();
const Chat = require("../controllers/chatController");

router.post("/tutor", Chat.tutorChat);

module.exports = router;
