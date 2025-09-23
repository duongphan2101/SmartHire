require("dotenv").config();
const OpenAI = require("openai");

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

module.exports = { summary, skills, experience, education, projects };
