const cron = require("node-cron");
const Interview = require("../models/Interview");
const axios = require("axios");
const { HOSTS } = require("../host.js");

cron.schedule("0 0 * * *", async () => {
    try {

        const now = new Date();
        console.log(`[CRON] 🕛 Chạy tác vụ lúc: ${now.toLocaleString()}`);
        const interviewsToReject = await Interview.find({
            scheduledAt: { $lt: now },
            status: "pending",
        });

        if (interviewsToReject.length === 0) {
            console.log("[CRON] Không có lịch phỏng vấn nào cần cập nhật.");
            return;
        }

        console.log(`[CRON] Tìm thấy ${interviewsToReject.length} lịch phỏng vấn để xử lý...`);

        let successCount = 0;
        let failCount = 0;

        for (const interview of interviewsToReject) {
            try {
                const apiPayload = {
                    canId: interview.candidateId,
                    jobId: interview.jobId,
                };

                console.log(`CANID: ${interview.userId} JOB: ${interview.jobId}`);

                const Apphost = HOSTS.application;

                await axios.post(
                    `${Apphost}/update-reject`,
                    apiPayload
                );

                interview.status = "rejected";
                await interview.save();

                console.log(`[CRON] ✅ Xử lý thành công Interview ${interview._id}`);
                successCount++;

            } catch (loopError) {
                console.error(`❌ [CRON] Lỗi khi xử lý Interview ${interview._id} (Job: ${interview.jobId}):`, loopError.message);
                failCount++;
            }
        }

        console.log(`[CRON] 🏁 Hoàn thành. Thành công: ${successCount}, Thất bại: ${failCount}`);

    } catch (err) {
        console.error("❌ [CRON] Lỗi nghiêm trọng khi chạy cron job:", err);
    }
}, { timezone: "Asia/Ho_Chi_Minh" });