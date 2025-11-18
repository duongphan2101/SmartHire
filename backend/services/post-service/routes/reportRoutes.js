const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Tạo báo cáo
router.post("/", reportController.createReport);

// Lấy báo cáo theo id
router.get("/:id", reportController.getReport);

module.exports = router;
