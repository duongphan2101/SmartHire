const express = require("express");
const router = express.Router();
const { register, login, refresh, loginWithFacebook, loginWithGoogle, updatePassword,verifyAccount } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/login/google", loginWithGoogle);
router.post("/login/facebook", loginWithFacebook);
router.post('/update-password', updatePassword);

router.post("/verify-account", verifyAccount);

module.exports = router;
