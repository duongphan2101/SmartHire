const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Tạo báo cáo
router.post("/", reportController.createReport);

router.get("/admin/reports", reportController.getAllReports);
router.get("/:id", reportController.getReport);

module.exports = router;
