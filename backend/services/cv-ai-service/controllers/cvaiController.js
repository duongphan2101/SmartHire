require("dotenv").config();
const OpenAI = require("openai");
const axios = require("axios");

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

// ===== COMMON HELPER =====
async function callAI(prompt, fieldName, content) {
  const response = await client.chat.completions.create({
    model: "deepseek-ai/DeepSeek-V3.1:fireworks-ai",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content },
    ],
    temperature: 0.7,
    max_tokens: 300,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

async function callAI_Cover(prompt, fieldName, content) {
  const response = await client.chat.completions.create({
    model: "deepseek-ai/DeepSeek-V3.1:fireworks-ai",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content },
    ],
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content;
  return safeParse(raw, fieldName);
}

function safeParse(content, fieldName) {
  try {
    return JSON.parse(content);
  } catch (err) {
    console.warn("safeParse JSON error:", err.message);
    return { [fieldName]: content };
  }
}


// ===== SUMMARY =====
async function summary(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Missing summary content" });

    const result = await callAI(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu phần Summary CV để ngắn gọn, chuyên nghiệp, 
       thu hút nhà tuyển dụng. Giữ giọng văn tự nhiên, tránh phóng đại.
       Trả về JSON: { "optimizedSummary": "<...>" }`,
      "optimizedSummary",
      content
    );

    res.json(result);
  } catch (err) {
    console.error("Summary optimization error:", err.message || err);
    res.status(500).json({ error: "Summary optimization error", details: err.message || String(err) });
  }
}

// ===== SKILLS =====
async function skills(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Missing skills content" });

    const result = await callAI(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu danh sách Skills để rõ ràng, phân nhóm hợp lý,
       tập trung vào kỹ năng quan trọng với nhà tuyển dụng.
       Trả về JSON: { "optimizedSkills": ["skill1", "skill2", ...] }`,
      "optimizedSkills",
      content
    );

    res.json(result);
  } catch (err) {
    console.error("Skills optimization error:", err.message || err);
    res.status(500).json({ error: "Skills optimization error", details: err.message || String(err) });
  }
}

// ===== EXPERIENCE =====
async function experience(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Missing experience content" });

    const result = await callAI(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu phần Kinh nghiệm làm việc (Experience),
       tập trung vào thành tựu (achievements), tác động và kết quả.
       Trả về JSON: { "optimizedExperience": "<...>" }`,
      "optimizedExperience",
      content
    );

    res.json(result);
  } catch (err) {
    console.error("Experience optimization error:", err.message || err);
    res.status(500).json({ error: "Experience optimization error", details: err.message || String(err) });
  }
}

// ===== EDUCATION =====
async function education(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Missing education content" });

    const result = await callAI(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu phần Học vấn (Education),
       giữ ngắn gọn nhưng nêu bật được trường, ngành, thành tích nổi bật.
       Trả về JSON: { "optimizedEducation": "<...>" }`,
      "optimizedEducation",
      content
    );

    res.json(result);
  } catch (err) {
    console.error("Education optimization error:", err.message || err);
    res.status(500).json({ error: "Education optimization error", details: err.message || String(err) });
  }
}

// ===== PROJECTS =====
async function projects(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Missing projects content" });

    const result = await callAI(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu phần Dự án (Projects), 
       nêu rõ vai trò, công nghệ sử dụng và kết quả đạt được.
       Trả về JSON: { "optimizedProjects": "<...>" }`,
      "optimizedProjects",
      content
    );

    res.json(result);
  } catch (err) {
    console.error("Projects optimization error:", err.message || err);
    res.status(500).json({ error: "Projects optimization error", details: err.message || String(err) });
  }
}

// ===== COVER LETTER =====
async function coverLetter(req, res) {
  try {
    const { cvId, jobId } = req.body;
    if (!cvId || !jobId) {
      return res.status(400).json({ error: "Missing cvId or jobId" });
    }

    const CV_SERVICE_URL = process.env.CV_SERVICE_URL;
    const JOB_SERVICE_URL = process.env.JOB_SERVICE_URL;

    console.log("Fetching CV from:", `${CV_SERVICE_URL}/cv/${cvId}`);
    console.log("Fetching Job from:", `${JOB_SERVICE_URL}/${jobId}`);

    // 1. Fetch CV + Job song song
    const [cvRes, jobRes] = await Promise.all([
      axios.get(`${CV_SERVICE_URL}/cv/${cvId}`),
      axios.get(`${JOB_SERVICE_URL}/${jobId}`),
    ]);

    const cv = cvRes.data;
    const job = jobRes.data;

    if (!cv) return res.status(404).json({ error: "CV not found" });
    if (!job) return res.status(404).json({ error: "Job not found" });

    // 2. Build input cho AI
    const candidateInfo = `
      Họ tên: ${cv.fullname || ""}
      Kỹ năng: ${(cv.skills || []).join(", ")}
      Kinh nghiệm: ${cv.experience || "Chưa có"} năm
      Học vấn: ${cv.education || ""}
    `;

    const jobInfo = `
      Vị trí: ${job.jobTitle || ""}
      Công ty: ${job.department?.name || ""}
      Yêu cầu: ${(job.requirement || []).join(", ")}
    `;

    console.log("Candidate info:", candidateInfo);
    console.log("Job info:", jobInfo);

    // 3. Prompt riêng
    const prompt = `
      Bạn là chuyên gia viết cover letter.
      Dựa trên thông tin ứng viên và công việc, hãy viết thư xin việc
      chuyên nghiệp, ngắn gọn, tập trung vào lý do ứng tuyển.
      Yêu cầu: Trả về JSON hợp lệ, format đúng:
      {
        "coverLetter": "Nội dung thư, các xuống dòng phải dùng \\n, không để raw newline"
      }
    `;

    // 4. Gọi AI
    let result;
    try {
      result = await callAI_Cover(
        prompt,
        "coverLetter",
        `
        Ứng viên:
        ${candidateInfo}

        Công việc:
        ${jobInfo}
        `
      );
    } catch (parseErr) {
      console.warn("AI JSON parse failed, fallback to raw string:", parseErr.message);
      result = { coverLetter: parseErr.message || "Không thể sinh cover letter" };
    }

    res.json(result);
  } catch (err) {
    console.error("CoverLetter generation error:", err.stack || err.message);
    res.status(500).json({
      error: "Cover letter generation error",
      details: err.message || String(err),
    });
  }
}




module.exports = { summary, skills, experience, education, projects, coverLetter };
