const express = require("express");
const router = express.Router();
const { register, login, refresh, loginWithFacebook, loginWithGoogle } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/login/google", loginWithGoogle);
router.post("/login/facebook", loginWithFacebook);


module.exports = router;
