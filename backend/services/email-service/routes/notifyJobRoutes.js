const express = require("express");
const router = express.Router();
const { sendJobSuggestionEmail, sendChatRequestEmail, sendInterviewResultEmail } = require("../controllers/notifyJobController");

router.post("/notify-job-tracking-email", sendJobSuggestionEmail);
router.post("/notify-chat-request", sendChatRequestEmail);
router.post("/notify-interview-result", sendInterviewResultEmail);

module.exports = router;
