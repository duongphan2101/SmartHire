const express = require("express");
const router = express.Router();
const { notifyApplication } = require("../controllers/applicationNotifyController");

// Endpoint để application-service gọi
router.post("/notify", notifyApplication);

module.exports = router;
