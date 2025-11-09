require("dotenv").config();
const axios = require("axios");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cấu hình an toàn (bắt buộc) - cho phép nội dung không nhạy cảm
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];


async function callGemini(systemPrompt, userContent, fieldName, maxTokens = 2048) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      systemInstruction: systemPrompt,
      safetySettings,
    });

    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userContent }] }],
      generationConfig,
    });

    const response = result.response;
    if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content) {
      console.error("LỖI: Gemini trả về nội dung rỗng. Lý do có thể là Safety Block.");
      console.log("Full Gemini Response:", JSON.stringify(response, null, 2));
      const finishReason = response.candidates?.[0]?.finishReason || "EMPTY_CANDIDATE";
      throw new Error(`Gemini response was empty or blocked. Finish Reason: ${finishReason}`);
    }
    const text = response.text();
    if (text === "") {
      console.error("LỖI: Gemini trả về chuỗi rỗng!");
      // Log này sẽ cho chúng ta biết lý do (ví dụ: finishReason: "SAFETY")
      console.log("Full response object:", JSON.stringify(response, null, 2));
    }
    return safeParse(text, fieldName);
  } catch (err) {
    console.error(`Gemini call error for ${fieldName}:`, err.message || err);
    if (err.response && err.response.text) {
      return safeParse(err.response.text(), fieldName);
    }
    throw err;
  }
}

function safeParse(content, fieldName) {
  try {
    return JSON.parse(content);
  } catch (err) {
    console.warn("safeParse JSON error:", err.message);
    // Fallback: Nếu AI trả về text rác, gói nó vào JSON
    return { [fieldName]: content };
  }
}


// ===== SUMMARY =====
async function summary(req, res) {
  try {
    const { content } = req.body;
    // console.log("ĐẦU VÀO /summary:", content);
    if (!content) return res.status(400).json({ error: "Missing summary content" });

    const result = await callGemini(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu phần Summary CV để ngắn gọn, chuyên nghiệp, 
       thu hút nhà tuyển dụng. Giữ giọng văn tự nhiên, tránh phóng đại.
       Trả về JSON: { "optimizedSummary": "<...>" }`,
      content,
      "optimizedSummary",
      2048
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Summary optimization error", details: err.message || String(err) });
  }
}

// ===== SKILLS =====
async function skills(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Missing skills content" });

    const result = await callGemini(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu danh sách Skills để rõ ràng, phân nhóm hợp lý,
       tập trung vào kỹ năng quan trọng với nhà tuyển dụng.
       Trả về JSON: { "optimizedSkills": ["skill1", "skill2", ...] }`,
      content,
      "optimizedSkills",
      2048
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Skills optimization error", details: err.message || String(err) });
  }
}

// ===== EXPERIENCE =====
async function experience(req, res) {
  try {
    const { content } = req.body;
        // console.log("ĐẦU VÀO /experience description:", content);
    if (!content) return res.status(400).json({ error: "Missing experience content" });

    const result = await callGemini(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu phần Kinh nghiệm làm việc (Experience),
       tập trung vào thành tựu (achievements), tác động và kết quả.
       Trả về JSON: { "optimizedExperience": "<...>" }`,
      content,
      "optimizedExperience",
      2048
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Experience optimization error", details: err.message || String(err) });
  }
}

// ===== EDUCATION =====
async function education(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Missing education content" });

    const result = await callGemini(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu phần Học vấn (Education),
       giữ ngắn gọn nhưng nêu bật được trường, ngành, thành tích nổi bật.
       Trả về JSON: { "optimizedEducation": "<...>" }`,
      content,
      "optimizedEducation",
      2048
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Education optimization error", details: err.message || String(err) });
  }
}

// ===== PROJECTS =====
async function projects(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Missing projects content" });

    const result = await callGemini(
      `Bạn là chuyên gia viết CV.
       Nhiệm vụ: tối ưu phần Dự án (Projects), 
       nêu rõ vai trò, công nghệ sử dụng và kết quả đạt được.
       Trả về JSON: { "optimizedProjects": "<...>" }`,
      content,
      "optimizedProjects",
      2048
    );

    res.json(result);
  } catch (err) {
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

    const [cvRes, jobRes] = await Promise.all([
      axios.get(`${CV_SERVICE_URL}/cv/${cvId}`),
      axios.get(`${JOB_SERVICE_URL}/${jobId}`),
    ]);

    const cv = cvRes.data;
    const job = jobRes.data;

    if (!cv) return res.status(404).json({ error: "CV not found" });
    if (!job) return res.status(404).json({ error: "Job not found" });

    const candidateInfo = `
      Họ tên: ${cv.fullname || ""}
      Kỹ năng: ${(cv.skills || []).join(", ")}
      Kinh nghiệm: ${cv.experience || "Chưa có"} năm
      Học vấn: ${cv.education || ""}
    `;

    // P/S: Dòng `job.department?.name` có vẻ lạ, 
    // bạn nên kiểm tra xem đây là "Tên công ty" hay "Tên phòng ban"
    const jobInfo = `
      Vị trí: ${job.jobTitle || ""}
      Công ty: ${job.companyName || job.department?.name || ""} 
      Yêu cầu: ${(job.requirement || []).join(", ")}
    `;

    const prompt = `
      Bạn là chuyên gia viết cover letter.
      Dựa trên thông tin ứng viên và công việc, hãy viết thư xin việc
      chuyên nghiệp, ngắn gọn, tập trung vào lý do ứng tuyển.
      Yêu cầu: Trả về JSON hợp lệ, format đúng:
      {
        "coverLetter": "Nội dung thư, các xuống dòng phải dùng \\n, không để raw newline"
      }
    `;

    const result = await callGemini(
      prompt,
      `Ứng viên:\n${candidateInfo}\n\nCông việc:\n${jobInfo}`,
      "coverLetter",
      2048
    );

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