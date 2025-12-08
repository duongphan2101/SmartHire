const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require("vnpay");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transactions");
const { verifyVNPay, createSecureHash } = require("../helpers/vnpay");
const { Types } = require("mongoose");

const createPayment = async (req, res) => {
  try {
    const { amount, orderId, userId } = req.body;

    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TMN_CODE,
      secureSecret: process.env.VNP_HASH_SECRET,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });
    const currentTime = new Date();
    const txnRef = `${orderId}_${currentTime.getTime()}`;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const baseUrl = process.env.VNP_RETURN_URL_BASE;
    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: amount * 100,
      vnp_IpAddr: req.ip || "127.0.0.1",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `${orderId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `${baseUrl}/vnpay_return?userId=${userId}`,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow)
    });

    return res.status(201).json(vnpayResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không tạo được link thanh toán" });
  }
};

const vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = { ...req.query };
    const secureHash = vnp_Params["vnp_SecureHash"] || "";
    const PORT = process.env.PORT;

    // Verify chữ ký
    const { valid, signData, signature } = verifyVNPay(
      vnp_Params,
      secureHash,
      process.env.VNP_HASH_SECRET
    );

    if (!valid) {
      return res.status(400).send("Chữ ký không hợp lệ (secure hash mismatch)");
    }

    const responseCode = vnp_Params["vnp_ResponseCode"];
    const providerTxnId = vnp_Params["vnp_TransactionNo"];
    const amountVND = parseInt(vnp_Params["vnp_Amount"], 10) / 100;
    const amount = amountVND / 1000; // 1 coin = 1000 VND
    const userId = req.query.userId;

    // ✅ Convert userId về ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid userId");
    }
    const userObjectId = new Types.ObjectId(userId);

    if (responseCode === "00") {
      await Transaction.create({
        userId: userObjectId,
        amount,
        type: "DEPOSIT",
        status: "SUCCESS",
        provider: "VNPAY",
        providerTxnId,
      });

      let wallet = await Wallet.findOne({ userId: userObjectId });
      if (!wallet) {
        wallet = await Wallet.create({ userId: userObjectId, balance: amount });
      } else {
        wallet.balance += amount;
        wallet.updatedAt = new Date();
        await wallet.save();
      }

      return res.redirect(`/api/wallet/success?amount=${amount}`);
    } else {
      await Transaction.create({
        userId: userObjectId,
        amount,
        type: "DEPOSIT",
        status: "FAILED",
        provider: "VNPAY",
        providerTxnId,
      });

      return res.redirect(`/api/wallet/failed?code=${responseCode}`);
    }
  } catch (err) {
    console.error("vnpay_return error:", err);
    return res.status(500).send("Lỗi xử lý callback VNPay");
  }
};

module.exports = {
  createPayment,
  vnpayReturn,
};
