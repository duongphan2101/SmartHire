require("dotenv").config();
const OpenAI = require("openai");
const axios = require("axios");

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

const JOB_SERVICE_URL = process.env.JOB_SERVICE_URL;

function extractJobQuery(text) {
  const lower = text.toLowerCase().normalize("NFC");
  if (!/(tìm|việc|job|intern|thực tập)/.test(lower)) return null;

  const query = {};
  if (/(thực tập|intern)/.test(lower)) query.title = "intern";
  else if (/(frontend|fe|react|angular|vue)/.test(lower)) query.title = "frontend";
  else if (/(backend|be|node|spring|java|\.net|express)/.test(lower)) query.title = "backend";
  else if (/(fullstack|mern|mean|full stack)/.test(lower)) query.title = "fullstack";
  else if (/(ai|machine learning|ml|deep learning)/.test(lower)) query.title = "ai";
  else if (/(data|analyst|database)/.test(lower)) query.title = "data";
  else if (/(devops|infrastructure|aws|docker|kubernetes)/.test(lower)) query.title = "devops";
  else if (/(mobile|react native|flutter|android|ios)/.test(lower)) query.title = "mobile";
  else if (/(test|qa|quality assurance)/.test(lower)) query.title = "qa";
  else if (/(ui|ux|designer|thiết kế)/.test(lower)) query.title = "designer";
  else if (/(project manager|pm|quản lý dự án)/.test(lower)) query.title = "project manager";

  if (/(hồ chí minh|hcm|tp\.hcm|sài gòn|sg)/.test(lower))
    query.location = "Thành phố Hồ Chí Minh";
  else if (/(hà nội|hn)/.test(lower)) query.location = "Hà Nội";
  else if (/(đà nẵng|danang|dn)/.test(lower)) query.location = "Đà Nẵng";

  if (/(part[- ]?time|bán thời gian)/.test(lower)) query.jobType = "Part-time";
  else if (/(full[- ]?time|toàn thời gian)/.test(lower)) query.jobType = "Full-time";
  else if (/(remote|làm từ xa|online)/.test(lower)) query.jobType = "Remote";

  if (/(intern|thực tập)/.test(lower)) query.jobLevel = "Intern";
  else if (/(junior|mới ra trường|fresher|sinh viên)/.test(lower)) query.jobLevel = "Junior";
  else if (/(mid|middle|trung cấp)/.test(lower)) query.jobLevel = "Mid-level";
  else if (/(senior|cao cấp|chuyên viên)/.test(lower)) query.jobLevel = "Senior";
  else if (/(lead|trưởng nhóm|team lead|leader)/.test(lower)) query.jobLevel = "Lead";

  return Object.keys(query).length > 0 ? query : null;
}

async function chatWithBot(req, res) {
  try {
    const { message } = req.body;

    // B1: Thử để model tự phân tích query JSON
    const aiResponse = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3.2-Exp:novita",
      messages: [
        {
          role: "system",
          content: `
            Bạn là SmartHire Chatbot – trợ lý AI giúp người dùng tìm việc.
            Nếu người dùng đang hỏi về tìm việc, hãy phân tích và trả về JSON dạng:
            {
              "title": "...",
              "location": "...",
              "jobType": "...",
              "jobLevel": "...",
              "experience": "..."
            }
            Còn nếu người dùng chỉ trò chuyện thông thường, chỉ cần trả lời tự nhiên.
            Khi có JSON, in thêm dòng:
            QUERY_JSON_START
            { ... }
            QUERY_JSON_END
          `,
        },
        { role: "user", content: message },
      ],
    });

    const content = aiResponse.choices[0].message.content || "";
    let query = null;

    const match = content.match(/QUERY_JSON_START([\s\S]*?)QUERY_JSON_END/);
    if (match) {
      try {
        query = JSON.parse(match[1].trim());
      } catch (e) {
        console.warn("Parse JSON thất bại:", e.message);
      }
    }

    if (!query) query = extractJobQuery(message);

    if (query) {
      const jobRes = await axios.get(JOB_SERVICE_URL, { params: query });
      const jobs = jobRes.data;

      if (!jobs?.length) {
        return res.json({
          reply: "Mình không tìm thấy công việc nào phù hợp 😢. Bạn có thể thử từ khóa khác không?",
        });
      }

      const jobItems = jobs.map((job) => ({
        id: job._id,
        title: job.jobTitle,
        company: job.companyName || "Không rõ công ty",
        location: job.location || "Không rõ địa điểm",
        jobType: job.jobType || "",
        level: job.jobLevel || "",
        salary: job.salary || "",
        link: `/jobdetail/${job._id}`,
      }));

      return res.json({
        type: "job_list",
        reply: `Mình tìm thấy ${jobs.length} công việc phù hợp 💼`,
        jobs: jobItems,
      });
    }

    const reply = content.replace(/QUERY_JSON_START[\s\S]*?QUERY_JSON_END/, "").trim();
    return res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message || err);
    return res.status(500).json({
      error: "Chatbot error",
      details: err.message || String(err),
    });
  }
}

module.exports = { chatWithBot };
