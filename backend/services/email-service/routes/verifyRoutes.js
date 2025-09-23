const express = require("express");
const router = express.Router();
const { sendVerifyEmail, verifyEmail } = require("../controllers/verifyController");

router.post("/send-verify", sendVerifyEmail);
router.get("/verify", verifyEmail);

module.exports = router;
