require("dotenv").config();
const axios = require("axios");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const formatCVtoText = (cv) => {
  let text = "";

  // SUMMARY — lấy từ introduction của CV
  text += `Tóm tắt (Summary): ${cv.introduction || ""}\n\n`;

  // BASIC INFO
  text += `Họ và tên: ${cv.name || ""}\n`;
  text += `Chức danh: ${cv.title || ""}\n\n`;

  // SKILLS
  text += `Kỹ năng chuyên môn:\n${cv.professionalSkills || ""}\n\n`;
  text += `Kỹ năng mềm:\n${cv.softSkills || ""}\n\n`;

  // EXPERIENCE
  if (cv.experience?.length > 0) {
    text += "Kinh nghiệm làm việc:\n";
    text += cv.experience
      .map(
        (e) =>
          `- ${e.jobTitle || ""} tại ${e.company || ""} (${e.startDate || ""} - ${
            e.endDate || ""
          }): ${e.description || ""}`
      )
      .join("\n");
    text += "\n\n";
  }

  // EDUCATION
  if (cv.education?.length > 0) {
    text += "Học vấn:\n";
    text += cv.education
      .map(
        (e) =>
          `- ${e.university || ""}, chuyên ngành ${e.major || ""}, GPA: ${
            e.gpa || ""
          } (${e.startYear || ""} - ${e.endYear || ""})`
      )
      .join("\n");
    text += "\n\n";
  }

  // PROJECTS
  if (cv.projects?.length > 0) {
    text += "Dự án:\n";
    text += cv.projects
      .map(
        (p) => `- ${p.projectName || ""}: ${p.projectDescription || ""}`
      )
      .join("\n");
    text += "\n\n";
  }

  // CERTIFICATIONS + AWARDS
  text += `Chứng chỉ:\n${cv.certifications || ""}\n\n`;
  text += `Hoạt động & Giải thưởng:\n${cv.activitiesAwards || ""}\n\n`;

  // CONTACT
  text += "Thông tin liên hệ:\n";
  if (cv.contact) {
    text += `- Email: ${cv.contact.email || ""}\n`;
    text += `- Số điện thoại: ${cv.contact.phone || ""}\n`;
    text += `- Địa chỉ: ${cv.contact.address || ""}\n`;
    text += `- Github: ${cv.contact.github || ""}\n`;
    text += `- Website: ${cv.contact.website || ""}\n`;
  }

  return text.replace(/\n\s*\n/g, "\n\n").trim();
};


// Cấu hình an toàn
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Helper function để tạm dừng (sleep)
 * @param {number} ms - Thời gian tạm dừng (miliseconds)
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Hàm gọi Gemini API với cơ chế retry (thử lại) tự động.
 * Sẽ thử lại nếu gặp lỗi 500, 503 (quá tải), hoặc 429 (rate limit).
 * @param {string} modelName - Tên model (vd: "gemini-2.5-pro", "gemini-2.5-flash")
 * @param {string} systemPrompt - Hướng dẫn hệ thống
 * @param {string} userContent - Nội dung prompt từ user
 * @param {string} fieldName - Tên trường JSON fallback
 * @param {number} maxTokens - Số tokens tối đa
 * @param {number} maxRetries - Số lần thử lại tối đa
 * @param {number} initialDelay - Thời gian chờ ban đầu (ms)
 * @returns {Promise<object>} - Kết quả JSON đã parse
 */
async function callGeminiWithRetry(
  modelName,
  systemPrompt,
  userContent,
  fieldName,
  maxTokens = 8192,
  maxRetries = 3,
  initialDelay = 2000 // 1 giây
) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
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

      // Kiểm tra nội dung rỗng hoặc bị chặn (safety)
      if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content) {
        const finishReason = response.candidates?.[0]?.finishReason || "EMPTY_CANDIDATE";
        console.error(`LỖI (Attempt ${attempt}/${maxRetries}): Gemini trả về nội dung rỗng. Lý do: ${finishReason}`);
        if (finishReason === "SAFETY" || finishReason === "RECITATION") {
          throw new Error(`Gemini response was blocked. Finish Reason: ${finishReason}`);
        }
        lastError = new Error(`Gemini response was empty. Finish Reason: ${finishReason}`);
        if (attempt === maxRetries) throw lastError;
      } else {
        const text = response.text();
        if (text === "") {
          console.error(`LỖI (Attempt ${attempt}/${maxRetries}): Gemini trả về chuỗi rỗng!`);
          lastError = new Error("Gemini returned an empty string.");
          if (attempt === maxRetries) throw lastError;
        } else {
          // THÀNH CÔNG!
          return safeParse(text, fieldName);
        }
      }
    } catch (err) {
      lastError = err;
      const errorMessage = (err.message || String(err)).toLowerCase();
      // Kiểm tra các lỗi có thể thử lại
      const isRetryable =
        errorMessage.includes("503") || // Service Unavailable (Quá tải)
        errorMessage.includes("500") || // Internal Server Error
        errorMessage.includes("overloaded") || // Thông báo quá tải
        errorMessage.includes("429"); // Rate limit (Quá nhiều request)

      if (isRetryable && attempt < maxRetries) {
        // Tính toán thời gian chờ (exponential backoff)
        const delay = initialDelay * Math.pow(2, attempt - 1); // vd: 1s, 2s, 4s
        console.warn(
          `LỖI (Attempt ${attempt}/${maxRetries}) for ${fieldName} (${modelName}): ${err.message}. Đang thử lại sau ${delay}ms...`
        );
        await sleep(delay);
        continue; // Chuyển sang lần thử tiếp theo
      } else {
        // Lỗi không thể thử lại (vd: 400 Bad Request) HOẶC đã hết số lần thử
        console.error(
          `LỖI CUỐI CÙNG (Attempt ${attempt}/${maxRetries}) for ${fieldName} (${modelName}):`,
          err.message || err
        );
        throw err; // Ném lỗi ra để endpoint handler bắt
      }
    }
  }
  // Fallback nếu vòng lặp kết thúc mà không thành công
  console.error(`Thoát khỏi vòng lặp retry cho ${fieldName} mà không thành công.`);
  throw lastError || new Error(`Unknown error after ${maxRetries} attempts.`);
}

/**
 * Parse JSON một cách an toàn
 */
function safeParse(content, fieldName) {
  try {
    return JSON.parse(content);
  } catch (err) {
    console.warn("safeParse JSON error:", err.message);
    // Fallback: Nếu AI trả về text rác, gói nó vào JSON
    return { [fieldName]: content };
  }
}

// ===== CV Analysis & Suggestion =====
// async function analysicCV(req, res) {
//   try {
//     const { cvId } = req.body;

//     if (!cvId) {
//       return res.status(400).json({ success: false, message: "Thiếu cvId" });
//     }

//     const cvResponse = await axios.get(`${process.env.CV_SERVICE_URL}/cv/${cvId}`);
//     const cv = cvResponse.data;

//     if (!cv) {
//       return res.status(404).json({ success: false, message: "Không tìm thấy CV" });
//     }

//     const cvText = formatCVtoText(cv);
//     const systemInstruction = `
//       Bạn là một chuyên gia tư vấn nghề nghiệp (Career Coach) và chuyên gia tuyển dụng (HR Specialist) với 10 năm kinh nghiệm.
//       Nhiệm vụ của bạn là phân tích hồ sơ ứng viên và đưa ra lời khuyên phát triển sự nghiệp.

//       QUY TẮC BẮT BUỘC:
//       1. Chỉ trả về kết quả dưới dạng JSON hợp lệ. Không trả về markdown (\`\`\`json).
//       2. Ngôn ngữ: Tiếng Việt.
//       3. Cấu trúc JSON phải chính xác như sau:
//       {
//         "summary": "Đoạn văn ngắn 2-3 câu tóm tắt hồ sơ và định hướng của ứng viên.",
//         "strengths": ["Điểm mạnh 1", "Điểm mạnh 2", "Điểm mạnh 3 (tối đa 5)"],
//         "weaknesses": ["Điểm yếu hoặc kỹ năng còn thiếu cần cải thiện"],
//         "suggested_skills": ["Tên kỹ năng 1", "Tên kỹ năng 2 (Gợi ý các công nghệ/kỹ năng hot thị trường cần)"],
//         "roadmap": [
//            "Bước 1: Hành động cụ thể...",
//            "Bước 2: Hành động cụ thể...",
//            "Bước 3: ..."
//         ]
//       }
//     `;

//     const userPrompt = `Hãy phân tích hồ sơ xin việc sau đây:\n\n${cvText}`;

//     const analysisResult = await callGeminiWithRetry(
//       "gemini-2.5-pro",
//       systemInstruction,
//       userPrompt,
//       "cv_analysis"
//     );

//     return res.status(200).json({
//       success: true,
//       data: analysisResult
//     });

//   } catch (error) {
//     console.error("Error in analysicCV:", error);
//     const status = error.response?.status || 500;
//     const message = error.message || "Lỗi Server khi phân tích CV";

//     return res.status(status).json({
//       success: false,
//       message: message
//     });
//   }
// }

async function analysicCV(req, res) {
  try {
    const { cvId } = req.body;

    if (!cvId) {
      return res.status(400).json({ success: false, message: "Thiếu cvId" });
    }

    const cvResponse = await axios.get(`${process.env.CV_SERVICE_URL}/cv/${cvId}`);
    const cv = cvResponse.data;

    if (!cv) {
      return res.status(404).json({ success: false, message: "Không tìm thấy CV" });
    }

    const cvText = formatCVtoText(cv);

    const systemInstruction = `
      Bạn là chuyên gia tuyển dụng và Career Coach với hơn 10 năm kinh nghiệm.

      QUY TẮC BẮT BUỘC:
      1. Chỉ trả về JSON hợp lệ (không markdown).
      2. Ngôn ngữ: Tiếng Việt.
      3. Không dùng %, không tính điểm, không scoring.
      4. Không tự bịa thông tin không có trong CV.
      5. Luôn trả về cấu trúc JSON chính xác.
      6. Luôn trả về đầy đủ các mục yêu cầu, không bỏ sót.
      7. Luôn ưu tiên phân tích dựa trên nội dung CV đã cho.
      
      - summary: (Viết đoạn tóm tắt 2–3 câu về hồ sơ, dựa trên toàn bộ nội dung CV.
        - Không được thêm thông tin không tồn tại trong CV.
        - Không copy nguyên văn.
        - Chỉ được phép diễn giải, tổng hợp, rút gọn lại những gì CV thể hiện.)

      - strengths
      - weaknesses
      - suggested_skills
      - roadmap

      —— CASE 1: Strength Extraction ——
      Trích xuất điểm mạnh thật sự từ CV.

      —— CASE 2: Missing Sections ——
      Liệt kê CV đang thiếu phần nào:
      - Kinh nghiệm làm việc
      - Học vấn
      - Kỹ năng
      - Dự án
      - Mục tiêu nghề nghiệp
      - Liên hệ
      (Chỉ liệt kê khi thực sự thiếu)

      —— CASE 3: Suggested Skills ——
      Gợi ý kỹ năng mới phù hợp thị trường (không tính điểm).

      —— CASE 4: Format & Layout Improvements ——
      Đưa ra các cải thiện bố cục CV:
      - cách sắp xếp mục
      - độ dài
      - mô tả kinh nghiệm
      - tính dễ đọc
      (Không đánh giá thiết kế UI vì không thấy ảnh)

      —— CASE 7: ATS Friendly Check ——
      Kiểm tra CV có thân thiện với ATS không:
      - từ khóa có đầy đủ không
      - có dùng icon gây lỗi parsing không
      - có thiếu cấu trúc ATS quan trọng không
      - gợi ý tăng khả năng ATS đọc được

      {
        "summary": "",
        "strengths": [],
        "weaknesses": [],
        "suggested_skills": [],
        "roadmap": [],

        "missing_sections": [],
        "format_tips": [],
        "ats_check": {
          "issues": [],
          "improvements": []
        }
      }
    `;

    const userPrompt = `Hãy phân tích nội dung CV sau đây:\n\n${cvText}`;

    const analysisResult = await callGeminiWithRetry(
      "gemini-2.5-pro",
      systemInstruction,
      userPrompt,
      "cv_analysis"
    );

    return res.status(200).json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error("Error in analysicCV:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi phân tích CV"
    });
  }
}

// ===== SUMMARY =====
async function summary(req, res) {
  try {
    // THÊM MỚI: Nhận 2 trường tùy chọn
    const { content, previousResult, refinementPrompt } = req.body;

    // Kiểm tra logic: Phải có "content" (tạo mới) HOẶC ("previousResult" VÀ "refinementPrompt") (chỉnh sửa)
    if (!content && !(previousResult && refinementPrompt)) {
      return res.status(400).json({ error: "Missing 'content' (for initial) or 'previousResult' + 'refinementPrompt' (for refinement)." });
    }

    const systemPrompt = `Bạn là chuyên gia viết CV.
      Nhiệm vụ: tối ưu phần Summary CV để ngắn gọn, chuyên nghiệp, 
      thu hút nhà tuyển dụng. Giữ giọng văn tự nhiên, tránh phóng đại.
      Luôn trả về JSON: { "optimizedSummary": "<...>" }`;

    let userContent = "";

    if (previousResult && refinementPrompt) {
      // TRƯỜNG HỢP 2: Chỉnh sửa
      userContent = `
Đây là bản nháp Summary trước đó (previousResult):
---
${previousResult}
---
Đây là hướng dẫn chỉnh sửa từ người dùng (refinementPrompt):
---
${refinementPrompt}
---
Hãy tạo một phiên bản Summary mới DỰA TRÊN BẢN NHÁP TRƯỚC ĐÓ và HƯỚNG DẪN CHỈNH SỬA.
Vẫn trả về JSON format { "optimizedSummary": "<...>" }.
      `;
    } else {
      // TRƯỜNG HỢP 1: Tạo mới (Logic cũ)
      userContent = `
Đây là nội dung Summary gốc của người dùng (content):
---
${content}
---
Hãy tối ưu nội dung này và trả về JSON format { "optimizedSummary": "<...>" }.
      `;
    }

    const result = await callGeminiWithRetry(
      "gemini-2.5-pro",
      systemPrompt,
      userContent,
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
    const { content, previousResult, refinementPrompt } = req.body;

    if (!content && !(previousResult && refinementPrompt)) {
      return res.status(400).json({ error: "Missing 'content' (for initial) or 'previousResult' + 'refinementPrompt' (for refinement)." });
    }

    const systemPrompt = `Bạn là chuyên gia viết CV.
      Nhiệm vụ: tối ưu danh sách Skills để rõ ràng, phân nhóm hợp lý,
      tập trung vào kỹ năng quan trọng với nhà tuyển dụng.
      Luôn trả về JSON: { "optimizedSkills": ["skill1", "skill2", ...] }`;

    let userContent = "";

    if (previousResult && refinementPrompt) {
      // TRƯỜNG HỢP 2: Chỉnh sửa
      userContent = `
Đây là bản nháp Skills trước đó (previousResult, là một JSON string array):
---
${previousResult}
---
Đây là hướng dẫn chỉnh sửa từ người dùng (refinementPrompt):
---
${refinementPrompt}
---
Hãy tạo một phiên bản Skills mới DỰA TRÊN BẢN NHÁP TRƯỚC ĐÓ và HƯỚNG DẪN CHỈNH SỬA.
Vẫn trả về JSON format { "optimizedSkills": ["skill1", "skill2", ...] }.
      `;
    } else {
      // TRƯỜNG HỢP 1: Tạo mới
      userContent = `
Đây là nội dung Skills gốc của người dùng (content):
---
${content}
---
Hãy tối ưu nội dung này và trả về JSON format { "optimizedSkills": ["skill1", "skill2", ...] }.
      `;
    }

    const result = await callGeminiWithRetry(
      "gemini-2.5-pro",
      systemPrompt,
      userContent,
      "optimizedSkills",
      2048
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Skills optimization error", details: err.message || String(err) });
    V
  }
}

// ===== EXPERIENCE =====
async function experience(req, res) {
  try {
    const { content, previousResult, refinementPrompt } = req.body;

    if (!content && !(previousResult && refinementPrompt)) {
      return res.status(400).json({ error: "Missing 'content' (for initial) or 'previousResult' + 'refinementPrompt' (for refinement)." });
    }

    const systemPrompt = `Bạn là chuyên gia viết CV.
      Nhiệm vụ: tối ưu phần Kinh nghiệm làm việc (Experience),
      tập trung vào thành tựu (achievements), tác động và kết quả.
      Luôn trả về JSON: { "optimizedExperience": "<...>" }`;

    let userContent = "";

    if (previousResult && refinementPrompt) {
      // TRƯỜNG HỢP 2: Chỉnh sửa
      userContent = `
Đây là bản nháp Experience trước đó (previousResult):
---
${previousResult}
---
Đây là hướng dẫn chỉnh sửa từ người dùng (refinementPrompt):
---
${refinementPrompt}
---
Hãy tạo một phiên bản Experience mới DỰA TRÊN BẢN NHÁP TRƯỚC ĐÓ và HƯỚNG DẪN CHỈNH SỬA.
Vẫn trả về JSON format { "optimizedExperience": "<...>" }.
      `;
    } else {
      // TRƯỜNG HỢP 1: Tạo mới
      userContent = `
Đây là nội dung Experience gốc của người dùng (content):
---
${content}
---
Hãy tối ưu nội dung này và trả về JSON format { "optimizedExperience": "<...>" }.
      `;
    }

    const result = await callGeminiWithRetry(
      "gemini-2.5-pro",
      systemPrompt,
      userContent,
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
    const { content, previousResult, refinementPrompt } = req.body;

    if (!content && !(previousResult && refinementPrompt)) {
      return res.status(400).json({ error: "Missing 'content' (for initial) or 'previousResult' + 'refinementPrompt' (for refinement)." });
    }

    const systemPrompt = `Bạn là chuyên gia viết CV.
      Nhiệm vụ: tối ưu phần Học vấn (Education),
      giữ ngắn gọn nhưng nêu bật được trường, ngành, thành tích nổi bật.
      Luôn trả về JSON: { "optimizedEducation": "<...>" }`;

    let userContent = "";

    if (previousResult && refinementPrompt) {
      // TRƯỜNG HỢP 2: Chỉnh sửa
      userContent = `
Đây là bản nháp Education trước đó (previousResult):
---
${previousResult}
---
Đây là hướng dẫn chỉnh sửa từ người dùng (refinementPrompt):
---
${refinementPrompt}
---
Hãy tạo một phiên bản Education mới DỰA TRÊN BẢN NHÁP TRƯỚC ĐÓ và HƯỚNG DẪN CHỈNH SỬA.
Vẫn trả về JSON format { "optimizedEducation": "<...>" }.
      `;
    } else {
      // TRƯỜNG HỢP 1: Tạo mới
      userContent = `
Đây là nội dung Education gốc của người dùng (content):
---
${content}
---
Hãy tối ưu nội dung này và trả về JSON format { "optimizedEducation": "<...>" }.
      `;
    }

    const result = await callGeminiWithRetry(
      "gemini-2.5-pro",
      systemPrompt,
      userContent,
      "optimizedEducation",
      2048
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Education optimization error", details: err.message || String(err) });
    V
  }
}

// ===== PROJECTS =====
async function projects(req, res) {
  try {
    const { content, previousResult, refinementPrompt } = req.body;

    if (!content && !(previousResult && refinementPrompt)) {
      return res.status(400).json({ error: "Missing 'content' (for initial) or 'previousResult' + 'refinementPrompt' (for refinement)." });
    }

    const systemPrompt = `Bạn là chuyên gia viết CV.
      Nhiệm vụ: tối ưu phần Dự án (Projects), 
      nêu rõ vai trò, công nghệ sử dụng và kết quả đạt được.
      Luôn trả về JSON: { "optimizedProjects": "<...>" }`;

    let userContent = "";

    if (previousResult && refinementPrompt) {
      // TRƯỜNG HỢP 2: Chỉnh sửa
      userContent = `
Đây là bản nháp Projects trước đó (previousResult):
---
${previousResult}
---
Đây là hướng dẫn chỉnh sửa từ người dùng (refinementPrompt):
---
${refinementPrompt}
---
Hãy tạo một phiên bản Projects mới DỰA TRÊN BẢN NHÁP TRƯỚC ĐÓ và HƯỚNG DẪN CHỈNH SỬA.
Vẫn trả về JSON format { "optimizedProjects": "<...>" }.
      `;
    } else {
      // TRƯỜNG HỢP 1: Tạo mới
      userContent = `
Đây là nội dung Projects gốc của người dùng (content):
---
${content}
---
Hãy tối ưu nội dung này và trả về JSON format { "optimizedProjects": "<...>" }.
      `;
    }

    const result = await callGeminiWithRetry(
      "gemini-2.5-pro",
      systemPrompt,
      userContent,
      "optimizedProjects",
      2048
    );

    res.json(result);
    V
  } catch (err) {
    res.status(500).json({ error: "Projects optimization error", details: err.message || String(err) });
  }
}

// ===== COVER LETTER =====
async function coverLetter(req, res) {
  try {
    // THÊM MỚI: Nhận 2 trường tùy chọn
    const { cvId, jobId, previousResult, refinementPrompt } = req.body;

    const systemPrompt = `
      Bạn là chuyên gia viết cover letter.
      Dựa trên thông tin được cung cấp, hãy viết thư xin việc
      chuyên nghiệp, ngắn gọn, tập trung vào lý do ứng tuyển.
      Yêu cầu: Trả về JSON hợp lệ, format đúng:
      {
        "coverLetter": "Nội dung thư, các xuống dòng phải dùng \\n, không để raw newline"
      }
    `;

    let userContent = "";

    if (previousResult && refinementPrompt) {
      // TRƯỜNG HỢP 2: Chỉnh sửa Cover Letter
      userContent = `
Đây là bản nháp Cover Letter trước đó (previousResult):
---
${previousResult}
---
Đây là hướng dẫn chỉnh sửa từ người dùng (refinementPrompt):
---
${refinementPrompt}
---
Hãy viết lại Cover Letter DỰA TRÊN BẢN NHÁP TRƯỚC ĐÓ và HƯỚNG DẪN CHỈNH SỬA.
Vẫn trả về JSON format { "coverLetter": "<...>" }.
      `;
    } else {
      // TRƯỜNG HỢP 1: Tạo mới Cover Letter (Logic cũ)
      if (!cvId || !jobId) {
        return res.status(400).json({ error: "Missing 'cvId' + 'jobId' (for initial) or 'previousResult' + 'refinementPrompt' (for refinement)." });
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
V       Kinh nghiệm: ${cv.experience || "Chưa có"} năm
        Học vấn: ${cv.education || ""}
      `;

      const jobInfo = `
        Vị trí: ${job.jobTitle || ""}
        Công ty: ${job.companyName || job.department?.name || ""} 
        Yêu cầu: ${(job.requirement || []).join(", ")}
      `;

      userContent = `
Hãy viết Cover Letter dựa trên thông tin sau:
---
Thông tin Ứng viên:
${candidateInfo}
---
Thông tin Công việc:
${jobInfo}
---
Hãy trả về JSON format { "coverLetter": "<...>" }.
V     `;
    }

    const result = await callGeminiWithRetry(
      "gemini-2.5-flash", // Vẫn dùng flash cho nhanh
      systemPrompt,
      userContent,
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


module.exports = { summary, skills, experience, education, projects, coverLetter, analysicCV };