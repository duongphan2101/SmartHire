const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["DEPOSIT", "WITHDRAW"], required: true },
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
  provider: { type: String, default: "VNPAY" },
  providerTxnId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
