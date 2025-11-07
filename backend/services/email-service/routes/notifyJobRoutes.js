const express = require("express");
const router = express.Router();
const { sendJobSuggestionEmail } = require("../controllers/notifyJobController");

router.post("/notify-job-tracking-email", sendJobSuggestionEmail);

module.exports = router;
