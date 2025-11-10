const express = require("express");
const router = express.Router();
const { sendJobSuggestionEmail, sendChatRequestEmail } = require("../controllers/notifyJobController");

router.post("/notify-job-tracking-email", sendJobSuggestionEmail);
router.post("/notify-chat-request", sendChatRequestEmail);

module.exports = router;
