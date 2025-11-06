// services/matchingService.js
const axios = require("axios");
const { getEmbedding } = require("../services/embeddingService");
const cosineSimilarity = require("../utils/cosineSim");
const { getGeminiMatch } = require("../services/geminiService");

const formatCVtoText = (cv) => `
${cv.name || ""}
Giới thiệu: ${cv.introduction || ""}
Kỹ năng chuyên môn: ${cv.professionalSkills || ""}
Kỹ năng mềm: ${cv.softSkills || ""}
Kinh nghiệm: ${cv.experience?.map(e => `${e.jobTitle} tại ${e.company}: ${e.description}`).join("; ") || ""}
Học vấn: ${cv.education?.map(e => `${e.university} - ${e.major}, GPA: ${e.gpa}`).join("; ") || ""}
Dự án: ${cv.projects?.map(p => `${p.projectName}: ${p.projectDescription}`).join("; ") || ""}
Chứng chỉ: ${cv.certifications || ""}
Hoạt động & Giải thưởng: ${cv.activitiesAwards || ""}
`.replace(/\s+/g, " ").trim();

const formatJobToText = (job) => `
${job.jobTitle || ""}
Yêu cầu: ${job.requirement?.join(", ") || ""}
Kỹ năng: ${job.skills?.join(", ") || ""}
Mô tả công việc: ${job.jobDescription?.join(". ") || ""}
Cấp bậc: ${job.jobLevel || ""}
Địa điểm: ${job.location || ""}
Lương: ${job.salary || ""}
`.replace(/\s+/g, " ").trim();

// 🔹 1️⃣ Match CV với tất cả Job
const matchAllJobs = async (req, res) => {
  try {
    const { cv_id } = req.body;
    if (!cv_id) return res.status(400).json({ error: "cv_id is required" });

    const { data: cv } = await axios.get(`${process.env.CV_SERVICE_URL}/cv/${cv_id}`);
    if (!cv) return res.status(404).json({ error: "CV not found" });

    const cvText = formatCVtoText(cv);
    const cvVector = await getEmbedding(cvText);

    const { data: jobs } = await axios.get(`${process.env.JOB_SERVICE_URL}/getAll`);

    const results = await Promise.all(
      jobs.map(async (job) => {
        const jobText = formatJobToText(job);
        const jobVector = await getEmbedding(jobText);
        const cosineScore = cosineSimilarity(cvVector, jobVector);
        const normalizedCosine = ((cosineScore + 1) / 2) * 100;

        const gemini = await getGeminiMatch(cvText, jobText);
        const finalScore = (normalizedCosine * 0.7 + gemini.score * 0.3).toFixed(2);

        return {
          job: job,
          title: job.jobTitle,
          cosineScore: normalizedCosine,
          aiScore: gemini.score,
          finalScore,
          reason: gemini.reason,
          strengths: gemini.strengths,
          weaknesses: gemini.weaknesses,
        };
      })
    );

    res.json(results.sort((a, b) => b.finalScore - a.finalScore));
  } catch (err) {
    console.error("❌ Matching error:", err);
    res.status(500).json({ error: "Error matching jobs" });
  }
};

// 🔹 1️⃣ Match CV với tất cả Job, lọc theo department
const matchDepartmentJobs = async (req, res) => {
  try {
    const { department_id, cv_id } = req.body;
    if (!department_id || !cv_id) {
      return res.status(400).json({ error: "department_id and cv_id are required" });
    }

    const { data: cv } = await axios.get(`${process.env.CV_SERVICE_URL}/cv/${cv_id}`);
    if (!cv) return res.status(404).json({ error: "CV not found" });

    const cvText = formatCVtoText(cv);
    const cvVector = await getEmbedding(cvText);

    const { data: jobs } = await axios.get(`${process.env.JOB_SERVICE_URL}/getAll/${department_id}`);
    if (!jobs || jobs.length === 0)
      return res.status(404).json({ error: "No jobs found in this department" });

    const results = await Promise.all(
      jobs.map(async (job) => {
        const jobText = `
        ${job.jobTitle}.
        Yêu cầu: ${job.requirement?.join(", ") || ""}.
        Kỹ năng: ${job.skills?.join(", ") || ""}.
        Mô tả: ${job.jobDescription?.join(". ") || ""}.
        `.trim();

        const jobVector = await getEmbedding(jobText);
        const cosineScore = cosineSimilarity(cvVector, jobVector);
        const normalizedCosine = ((cosineScore + 1) / 2) * 100;

        const gemini = await getGeminiMatch(cvText, jobText);
        const finalScore = (normalizedCosine * 0.7 + gemini.score * 0.3).toFixed(2);

        return {
          jobId: job._id,
          title: job.jobTitle,
          departmentId: department_id,
          cosineScore: normalizedCosine,
          aiScore: gemini.score,
          finalScore,
          reason: gemini.reason,
          strengths: gemini.strengths,
          weaknesses: gemini.weaknesses,
        };
      })
    );

    results.sort((a, b) => b.finalScore - a.finalScore);

    res.json(results);
  } catch (err) {
    console.error("❌ Matching error:", err);
    res.status(500).json({ error: "Error matching jobs in department" });
  }
};

// 🔹 2️⃣ Match 1 CV với 1 Job
const matchOne = async (req, res) => {
  try {
    const { job_id, cv_id } = req.body;
    if (!job_id || !cv_id)
      return res.status(400).json({ error: "job_id and cv_id are required" });

    const { data: job } = await axios.get(`${process.env.JOB_SERVICE_URL}/${job_id}`);
    const { data: cv } = await axios.get(`${process.env.CV_SERVICE_URL}/cv/${cv_id}`);
    if (!job || !cv) return res.status(404).json({ error: "Job or CV not found" });

    const cvText = formatCVtoText(cv);
    const jobText = formatJobToText(job);

    const cvVector = await getEmbedding(cvText);
    const jobVector = await getEmbedding(jobText);

    const cosineScore = cosineSimilarity(cvVector, jobVector);
    const normalizedCosine = ((cosineScore + 1) / 2) * 100;

    const gemini = await getGeminiMatch(cvText, jobText);
    const finalScore = (normalizedCosine * 0.7 + gemini.score * 0.3).toFixed(2);

    res.json({
      jobId: job._id,
      title: job.jobTitle,
      cvId: cv._id,
      cosineScore: normalizedCosine,
      aiScore: gemini.score,
      finalScore,
      reason: gemini.reason,
      strengths: gemini.strengths,
      weaknesses: gemini.weaknesses,
    });
  } catch (err) {
    console.error("❌ Matching error:", err);
    res.status(500).json({ error: "Error matching CV and Job" });
  }
};

// 🔹 3️⃣ Match 1 Job với tất cả CV
const matchAllCVs = async (req, res) => {
  try {
    const { job_id } = req.body;
    if (!job_id) return res.status(400).json({ error: "job_id is required" });

    const { data: job } = await axios.get(`${process.env.JOB_SERVICE_URL}/${job_id}`);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const jobText = formatJobToText(job);
    const jobVector = await getEmbedding(jobText);

    const { data: cvs } = await axios.get(`${process.env.CV_SERVICE_URL}/all-cv`);

    const results = await Promise.all(
      cvs.map(async (cv) => {
        const cvText = formatCVtoText(cv);
        const cvVector = await getEmbedding(cvText);

        const cosineScore = cosineSimilarity(cvVector, jobVector);
        const normalizedCosine = ((cosineScore + 1) / 2) * 100;

        const gemini = await getGeminiMatch(cvText, jobText);
        const finalScore = (normalizedCosine * 0.7 + gemini.score * 0.3).toFixed(2);

        let user = null;
        try {
          const { data: userData } = await axios.get(`${process.env.USER_SERVICE_URL}/${cv.user_id}`);
          user = userData;
        } catch {
          user = null;
        }

        return {
          cvId: cv._id,
          userId: cv.user_id,
          user,
          cosineScore: normalizedCosine,
          aiScore: gemini.score,
          finalScore,
          reason: gemini.reason,
        };
      })
    );

    res.json(results.sort((a, b) => b.finalScore - a.finalScore));
  } catch (err) {
    console.error("❌ Matching error:", err);
    res.status(500).json({ error: "Error matching CVs" });
  }
};

module.exports = {
  matchAllJobs,
  matchDepartmentJobs,
  matchOne,
  matchAllCVs,
};
