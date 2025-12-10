const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transactions");
const mongoose = require("mongoose");
const { Types } = require("mongoose");

// Lấy số dư ví
const getWallet = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid userId format" });
        }

        const wallet = await Wallet.findOne({ userId: new mongoose.Types.ObjectId(userId) });

        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        return res.json(wallet.balance);
    } catch (err) {
        console.error("getWallet error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getWalletx = async (req, res) => {
    try {
        const { userId } = req.params; // giả sử bạn truyền /wallet/:userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid userId" });
        }

        const wallet = await Wallet.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy lịch sử giao dịch
const getTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        const txns = await Transaction.find({ userId }).sort({ createdAt: -1 });

        return res.json(txns);
    } catch (err) {
        console.error("getTransactions error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const createWallet = async (req, res) => {
    try {
        const { userId } = req.body;

        let wallet = await Wallet.findOne({ userId });
        if (wallet) {
            return res.status(400).json({ message: "Wallet already exists" });
        }

        wallet = await Wallet.create({
            userId,
            balance: 0
        });

        return res.status(201).json(wallet);
    } catch (err) {
        console.error("createWallet error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Nạp coin
const depositCoins = async (req, res) => {
    try {
        const { userId, amount, provider } = req.body;

        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid userId or amount" });
        }

        // Tìm ví
        let wallet = await Wallet.findOne({ userId: new mongoose.Types.ObjectId(userId) });

        if (!wallet) {
            // Nếu user chưa có ví thì tạo ví mới
            wallet = await Wallet.create({
                userId,
                balance: amount,
            });
        } else {
            wallet.balance += amount;
            wallet.updatedAt = new Date();
            await wallet.save();
        }

        // Lưu transaction
        const txn = await Transaction.create({
            userId,
            amount,
            type: "DEPOSIT",
            status: "SUCCESS",
            provider, // Phuong Thuc
        });

        return res.status(200).json({ wallet, transaction: txn });
    } catch (err) {
        console.error("depositCoins error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Trừ coin
const withdrawCoins = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        // console.log(`UserID: ${userId} and Amount: ${amount}`);

        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid userId or amount" });
        }

        const wallet = await Wallet.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });

        if (wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Trừ coin
        wallet.balance -= amount;
        wallet.updatedAt = new Date();
        await wallet.save();

        // Lưu transaction
        const txn = await Transaction.create({
            userId,
            amount,
            type: "WITHDRAW",
            status: "SUCCESS"
        });

        return res.status(200).json({ wallet, transaction: txn });
    } catch (err) {
        console.error("withdrawCoins error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Hiển thị trang khi thanh toán thành công
const paymentSuccess = async (req, res) => {
    try {
        const { amount } = req.query;
        return res.status(200).send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f6ffed; min-height: 100vh;">
        <h1 style="color: #52c41a; font-size: 32px;">✅ Thanh toán thành công!</h1>
        <p style="font-size: 20px; margin: 20px 0;">
          Bạn đã nạp thành công <strong style="color: #1890ff;">${amount}</strong> coin vào ví 🎉
        </p>
        <a href="http://localhost/dashboard" 
           style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #1890ff; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
           Quay lại trang chủ
        </a>
      </div>
    `);
    } catch (err) {
        console.error("paymentSuccess error:", err);
        return res.status(500).send("Lỗi khi xử lý thành công");
    }
};

// Hiển thị trang khi thanh toán thất bại
const paymentFailed = async (req, res) => {
    try {
        const { code } = req.query;
        return res.status(400).send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #fff2f0; min-height: 100vh;">
        <h1 style="color: #f5222d; font-size: 32px;">❌ Thanh toán thất bại!</h1>
        <p style="font-size: 20px; margin: 20px 0;">
          Mã lỗi: <strong style="color: #cf1322;">${code}</strong>
        </p>
        <a href="http://localhost/dashboard" 
           style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #f5222d; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
           Quay lại trang chủ
        </a>
      </div>
    `);
    } catch (err) {
        console.error("paymentFailed error:", err);
        return res.status(500).send("Lỗi khi xử lý thất bại");
    }
};

module.exports = {
    getWallet,
    getWalletx,
    getTransactions,
    createWallet,
    depositCoins,
    withdrawCoins,
    paymentSuccess,
    paymentFailed
};
