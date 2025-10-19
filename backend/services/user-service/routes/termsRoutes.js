const express = require("express");
const router = express.Router();
const { getTermsContent, updateTermsContent } = require("../controllers/termsController");

// Nếu người dùng không truyền vai trò
router.get("/", (req, res) => {
  res.status(400).json({
    message: "Thiếu vai trò. Vui lòng thêm /user hoặc /hr vào URL.",
  });
});

// Route chính: /api/terms/user hoặc /api/terms/hr
router.get("/:role", getTermsContent);
router.put("/:role", updateTermsContent);
module.exports = router;
