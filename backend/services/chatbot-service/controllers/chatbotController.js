require("dotenv").config();
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const JOB_SERVICE_URL = process.env.JOB_SERVICE_URL;

function extractJobQuery(text) {
  // 1. Chuẩn hóa chuỗi: chuyển thường, bỏ dấu câu thừa
  const lower = text.toLowerCase().normalize("NFC").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
  if (!/(tìm|việc|job|intern|thực tập|tuyển|work|career|vacancy)/.test(lower)) return null;

  const query = {};

  // --- 2. XỬ LÝ JOB TITLE (Mảng kỹ thuật/ngành nghề) ---
  if (/(frontend|front-end|fe\b|react|angular|vue|nextjs|typescript|javascript|html|css)/.test(lower)) {
    query.title = "Frontend";
  }
  else if (/(backend|back-end|be\b|node|express|nest|java\b|spring|python|django|golang|php|\.net|c#)/.test(lower)) {
    query.title = "Backend";
  }
  else if (/(fullstack|full-stack|mern|mean|lập trình viên)/.test(lower)) {
    query.title = "Fullstack";
  }
  else if (/(mobile|android|ios|flutter|react native|swift|kotlin)/.test(lower)) {
    query.title = "Mobile";
  }
  else if (/(ai\b|machine learning|ml\b|deep learning|nlp|computer vision|python)/.test(lower)) {
    query.title = "AI";
  }
  else if (/(data|analyst|engineer|sql|etl|spark|bi\b|database)/.test(lower)) {
    query.title = "Data";
  }
  else if (/(devops|sysadmin|aws|cloud|docker|kubernetes|ci\/cd|linux)/.test(lower)) {
    query.title = "DevOps";
  }
  else if (/(test|qa|qc|tester|automation|manual|quality)/.test(lower)) {
    query.title = "QA";
  }
  else if (/(ui|ux|design|thiết kế|figma|photoshop|adobe)/.test(lower)) {
    query.title = "Designer";
  }
  else if (/(ba\b|business analyst|nghiệp vụ)/.test(lower)) {
    query.title = "Business Analyst";
  }
  else if (/(pm\b|project manager|quản lý dự án|product owner)/.test(lower)) {
    query.title = "Project Manager";
  }

  // --- 3. XỬ LÝ LOCATION (Địa điểm) ---
  if (/(hồ chí minh|hcm|tp\.hcm|tphcm|sài gòn|sg|sai gon)/.test(lower)) {
    query.location = "Thành phố Hồ Chí Minh";
  }
  else if (/(hà nội|hn|hanoi|ha noi)/.test(lower)) {
    query.location = "Hà Nội";
  }
  else if (/(đà nẵng|danang|dn|da nang)/.test(lower)) {
    query.location = "Đà Nẵng";
  }

  // --- 4. XỬ LÝ JOB TYPE (Loại hình) ---
  if (/(part[- ]?time|bán thời gian)/.test(lower)) {
    query.jobType = "Part-time";
  }
  else if (/(full[- ]?time|toàn thời gian)/.test(lower)) {
    query.jobType = "Full-time";
  }
  else if (/(remote|làm từ xa|online|tại nhà|wfh)/.test(lower)) {
    query.jobType = "Remote";
  }

  // --- 5. XỬ LÝ JOB LEVEL (Cấp bậc) ---
  if (/(intern|thực tập|tuyển sinh)/.test(lower)) {
    query.jobLevel = "Intern";
    if (!query.title) query.title = "Intern";
  }
  else if (/(fresher|mới ra trường|sinh viên|junior|nhập môn)/.test(lower)) {
    query.jobLevel = "Junior";
  }
  else if (/(mid|middle|trung cấp|1-3 năm)/.test(lower)) {
    query.jobLevel = "Mid-level";
  }
  else if (/(senior|cao cấp|chuyên gia|trên 3 năm)/.test(lower)) {
    query.jobLevel = "Senior";
  }
  else if (/(lead|trưởng nhóm|quản lý|tech lead)/.test(lower)) {
    query.jobLevel = "Lead";
  }
  return Object.keys(query).length > 0 ? query : null;
}

async function chatWithBot(req, res) {
  try {
    const { message } = req.body;

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
        Bạn là SmartHire Chatbot – trợ lý AI giúp người dùng tìm việc.
        Nếu người dùng đang hỏi về tìm việc, hãy phân tích và trả về JSON dạng:
        {
          "title": "...",
          "location": "...",
          "jobType": "...",
          "jobLevel": "...",
          "experience": "..."
        }
        (Lưu ý: chỉ trả về các trường có thông tin, nếu không có thì bỏ qua trường đó).
        Còn nếu người dùng chỉ trò chuyện thông thường, chỉ cần trả lời tự nhiên.
        Khi có JSON, in thêm dòng:
        QUERY_JSON_START
        { ... }
        QUERY_JSON_END
      `,
    });

    const chat = model.startChat({
      history: [],
    });

    const aiResult = await chat.sendMessage(message);
    const aiResponse = aiResult.response;
    const content = aiResponse.text() || "";

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

    const reply = content
      .replace(/QUERY_JSON_START[\s\S]*?QUERY_JSON_END/, "")
      .trim();
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