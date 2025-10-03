const express = require("express");
const router = express.Router();
const { getWallet, getWalletx, getTransactions, createWallet, depositCoins, withdrawCoins, paymentFailed, paymentSuccess} = require("../controller/walletController");

router.get("/success", paymentSuccess);
router.get("/failed", paymentFailed);
router.get("/:userId", getWallet);
router.get("/x/:userId", getWalletx);
router.get("/:userId/transactions", getTransactions);
router.post("/", createWallet);  
router.post("/deposit", depositCoins);  
router.post("/withdraw", withdrawCoins);


module.exports = router;
