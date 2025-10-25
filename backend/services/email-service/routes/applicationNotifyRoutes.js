const express = require("express");
const router = express.Router();
const { notifyApplication, notifyInterview } = require("../controllers/applicationNotifyController");

// Endpoint để application-service gọi
router.post("/notify", notifyApplication);
router.post("/interview", notifyInterview);

module.exports = router;
