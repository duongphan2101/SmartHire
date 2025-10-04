const express = require("express");
const { createPayment, vnpayReturn } = require("../controller/paymentController");

const router = express.Router();

router.post("/create-qr", createPayment);
router.get("/vnpay_return", vnpayReturn);

module.exports = router;
