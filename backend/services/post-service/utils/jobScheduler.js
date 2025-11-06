const cron = require("node-cron");
const Job = require("../models/Job");

// Cron chạy mỗi ngày lúc 00:00 (12h đêm)
// cron.schedule("0 17 * * *", async () => {
// cron.schedule("45 21 * * *", async () => {
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    // Cập nhật job hết hạn -> expired
    const expiredResult = await Job.updateMany(
      { endDate: { $lt: now }, status: { $ne: "expired" } },
      { $set: { status: "expired" } }
    );

    console.log(`🕛 [CRON] Updated ${expiredResult.modifiedCount} job(s) to expired at ${now.toLocaleString()}`);
  } catch (err) {
    console.error("❌ [CRON] Error updating job statuses:", err);
  }
}, { timezone: "Asia/Ho_Chi_Minh" });
