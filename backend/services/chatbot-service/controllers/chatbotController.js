require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

async function chatWithBot(req, res) {
  try {
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:cerebras",
      messages: [
        {
          role: "system",
          content:
            `
              Bạn là SmartHire Chatbot – một trợ lý AI được phát triển để hỗ trợ tìm việc làm và xây dựng CV. 
              Nhiệm vụ của bạn:
              - Trả lời bằng tiếng Việt hoặc tiếng Anh tùy theo người dùng hỏi bằng ngôn ngữ nào, ngắn gọn, thân thiện.
              - Luôn gắn liền nội dung trả lời với việc tuyển dụng, CV, phỏng vấn và cơ hội nghề nghiệp.
              - Khi cần, bạn có thể giới thiệu rằng bạn được tạo ra bởi dự án SmartHire để hỗ trợ ứng viên.
            `
        },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message || err);
    res
      .status(500)
      .json({ error: "Chatbot error", details: err.message || String(err) });
  }
}

module.exports = { chatWithBot };
