import axios from "axios";
import { getEmbedding } from "../services/embeddingService.js";
import cosineSimilarity from "../utils/cosineSim.js";

// Hàm format CV JSON thành text
const formatCVtoText = (cv) => {
    return `
        ${cv.name || ""}
        Giới thiệu: ${cv.introduction || ""}
        Kỹ năng chuyên môn: ${cv.professionalSkills || ""}
        Kỹ năng mềm: ${cv.softSkills || ""}
        Kinh nghiệm: ${cv.experience || ""}
        Học vấn: ${cv.education?.map(e => `${e.university} - ${e.major}, GPA: ${e.gpa}`).join("; ") || ""}
        Dự án: ${cv.projects?.map(p => `${p.projectName}: ${p.projectDescription}`).join("; ") || ""}
        Chứng chỉ: ${cv.certifications || ""}
        Hoạt động & Giải thưởng: ${cv.activitiesAwards || ""}
    `.replace(/\s+/g, " ").trim();
};

export const matchDepartmentJobs = async (req, res) => {
    try {
        const { department_id, cv_id } = req.body;
        if (!department_id || !cv_id) {
            return res.status(400).json({ error: "department_id and cv_id are required" });
        }

        // Gọi CV Service để lấy CV theo cv_id
        const { data: cv } = await axios.get(`${process.env.CV_SERVICE_URL}/cv/${cv_id}`);
        if (!cv) return res.status(404).json({ error: "CV not found" });

        // Chuyển CV JSON thành cvText
        const cvText = formatCVtoText(cv);

        // Tạo embedding cho CV
        const cvVector = await getEmbedding(cvText);

        // Gọi Job Service để lấy jobs theo department_id
        const { data: jobs } = await axios.get(`${process.env.JOB_SERVICE_URL}/getAll/${department_id}`);

        const results = [];
        for (const job of jobs) {
            const requirementText = job.requirement?.join(". ") || "";
            const skillsText = job.skills?.join(", ") || "";
            const descriptionText = job.jobDescription?.join(". ") || "";

            // Embedding từng phần job
            const reqVector = await getEmbedding(requirementText);
            const skillsVector = await getEmbedding(skillsText);
            const descVector = await getEmbedding(descriptionText);

            // Điểm có trọng số
            const reqScore = cosineSimilarity(cvVector, reqVector);
            const skillsScore = cosineSimilarity(cvVector, skillsVector);
            const descScore = cosineSimilarity(cvVector, descVector);

            const finalScore = reqScore * 0.5 + skillsScore * 0.3 + descScore * 0.2;
            const normalizedScore = ((finalScore + 1) / 2) * 100;

            results.push({
                // jobId: job._id,
                // title: job.jobTitle,
                cvId: cv_id,
                score: normalizedScore
            });
        }

        results.sort((a, b) => b.score - a.score);
        res.json(results);
    } catch (err) {
        console.error("❌ Matching error:", err);
        res.status(500).json({ error: "Error matching jobs" });
    }
};

export const matchAllJobs = async (req, res) => {
    try {
        const { cv_id } = req.body;
        console.log("CV: ",cv_id);
        if (!cv_id) {
            return res.status(400).json({ error: "cv_id are required" });
        }

        // Lấy CV
        const { data: cv } = await axios.get(`${process.env.CV_SERVICE_URL}/cv/${cv_id}`);
        if (!cv) return res.status(404).json({ error: "CV not found" });

        const cvText = formatCVtoText(cv);
        const cvVector = await getEmbedding(cvText);

        // Lấy danh sách jobs theo department
        const { data: jobs } = await axios.get(`${process.env.JOB_SERVICE_URL}/getAll`);

        const results = await Promise.all(
            jobs.map(async (job) => {
                const requirementText = job.requirement?.join(". ") || "";
                const skillsText = job.skills?.join(", ") || "";
                const descriptionText = job.jobDescription?.join(". ") || "";

                const reqScore = cosineSimilarity(cvVector, await getEmbedding(requirementText));
                const skillsScore = cosineSimilarity(cvVector, await getEmbedding(skillsText));
                const descScore = cosineSimilarity(cvVector, await getEmbedding(descriptionText));

                const finalScore = reqScore * 0.5 + skillsScore * 0.3 + descScore * 0.2;
                const normalizedScore = ((finalScore + 1) / 2) * 100;

                return {
                    // jobId: job._id,
                    // title: job.jobTitle,
                    cvId: cv_id,
                    score: normalizedScore
                };
            })
        );

        res.json(results.sort((a, b) => b.score - a.score));
    } catch (err) {
        console.error("❌ Matching error:", err);
        res.status(500).json({ error: "Error matching jobs" });
    }
};

// Match 1 Job – nhiều CV + lấy thêm user info
export const matchAllCVs = async (req, res) => {
    try {
        const { job_id } = req.body;
        if (!job_id) return res.status(400).json({ error: "job_id is required" });

        // Lấy job
        const { data: job } = await axios.get(`${process.env.JOB_SERVICE_URL}/${job_id}`);
        if (!job) return res.status(404).json({ error: "Job not found" });

        // Chuẩn bị embedding job
        const reqVector = await getEmbedding(job.requirement?.join(". ") || "");
        const skillsVector = await getEmbedding(job.skills?.join(", ") || "");
        const descVector = await getEmbedding(job.jobDescription?.join(". ") || "");

        // Lấy tất cả CV
        const { data: cvs } = await axios.get(`${process.env.CV_SERVICE_URL}/all-cv`);

        const results = await Promise.all(
            cvs.map(async (cv) => {
                // Embedding cho CV
                const cvVector = await getEmbedding(formatCVtoText(cv));

                const reqScore = cosineSimilarity(cvVector, reqVector);
                const skillsScore = cosineSimilarity(cvVector, skillsVector);
                const descScore = cosineSimilarity(cvVector, descVector);

                const finalScore = reqScore * 0.5 + skillsScore * 0.3 + descScore * 0.2;
                const normalizedScore = ((finalScore + 1) / 2) * 100;

                // Gọi user service để lấy thông tin user
                let user = null;
                try {
                    const { data: userData } = await axios.get(
                        `${process.env.USER_SERVICE_URL}/${cv.user_id}`
                    );
                    user = userData;
                } catch (err) {
                    console.error(`⚠️ Không lấy được user ${cv.user_id}:`, err.message);
                }

                return {
                    cvId: cv._id,
                    userId: cv.user_id,
                    user,
                    score: normalizedScore,
                };
            })
        );

        res.json(results.sort((a, b) => b.score - a.score));
    } catch (err) {
        console.error("❌ Matching error:", err);
        res.status(500).json({ error: "Error matching CVs" });
    }
};

// Match 1 CV – 1 Job
export const matchOne = async (req, res) => {
    try {
        const { job_id, cv_id } = req.body;
        if (!job_id || !cv_id) {
            return res.status(400).json({ error: "job_id and cv_id are required" });
        }

        const { data: job } = await axios.get(`${process.env.JOB_SERVICE_URL}/${job_id}`);
        const { data: cv } = await axios.get(`${process.env.CV_SERVICE_URL}/cv/${cv_id}`);
        if (!job || !cv) return res.status(404).json({ error: "Job or CV not found" });

        const cvVector = await getEmbedding(formatCVtoText(cv));

        const reqVector = await getEmbedding(job.requirement?.join(". ") || "");
        const skillsVector = await getEmbedding(job.skills?.join(", ") || "");
        const descVector = await getEmbedding(job.jobDescription?.join(". ") || "");

        const reqScore = cosineSimilarity(cvVector, reqVector);
        const skillsScore = cosineSimilarity(cvVector, skillsVector);
        const descScore = cosineSimilarity(cvVector, descVector);

        const finalScore = reqScore * 0.5 + skillsScore * 0.3 + descScore * 0.2;
        const normalizedScore = ((finalScore + 1) / 2) * 100;

        res.json({
            // jobId: job._id,
            // jobTitle: job.jobTitle,
            cvId: cv._id,
            // name: cv.name,
            score: normalizedScore,
        });
    } catch (err) {
        console.error("❌ Matching error:", err);
        res.status(500).json({ error: "Error matching CV and Job" });
    }
};
