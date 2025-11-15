const express = require("express");
const router = express.Router();
const { sendJobSuggestionEmail, sendChatRequestEmail, sendInterviewResultEmail, sendPostApprovalEmail } = require("../controllers/notifyJobController");

router.post("/notify-job-tracking-email", sendJobSuggestionEmail);
router.post("/notify-chat-request", sendChatRequestEmail);
router.post("/notify-interview-result", sendInterviewResultEmail);
router.post("/notify-post-approva", sendPostApprovalEmail);

module.exports = router;
