const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
  checkOtpStatus
} = require("../controllers/forgotPasswordController");

router.post("/forgot", forgotPassword);
router.post("/verify", verifyOtp);
router.post("/reset", resetPassword);
router.post("/resend", resendOtp);
router.post("/status", checkOtpStatus);

module.exports = router;