import axios from "axios";

export const getGeminiMatch = async (cvText, jobText) => {
  const prompt = `
Bạn là một chuyên gia tuyển dụng. 
So sánh ứng viên (CV) với yêu cầu công việc bên dưới.
Đánh giá mức độ phù hợp từ 0-100.
Trả về JSON theo format:
{
  "score": number,
  "reason": string,
  "strengths": string[],
  "weaknesses": string[]
}

CV:
${cvText}

JOB:
${jobText}
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
      { contents: [{ parts: [{ text: prompt }] }] },
      { params: { key: process.env.GOOGLE_API_KEY } }
    );

    let text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // 🧹 Làm sạch Markdown và code block
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/[\n\r]+/g, " ")
      .trim();

    // 🧠 Parse JSON an toàn
    const result = JSON.parse(text);
    return result;
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    return { score: 50, reason: "Gemini API fallback", strengths: [], weaknesses: [] };
  }
};
