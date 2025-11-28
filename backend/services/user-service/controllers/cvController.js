const CV = require("../models/CV");
const User = require("../models/User");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

// Create CV
exports.createCV = async (req, res) => {
  try {
    const { userId, cvData, pdfUrl } = req.body;

    // console.log(req.body);
    // console.log("DATA: ", cvData.name);

    if (!userId || !cvData || !pdfUrl) return res.status(400).json({ error: "Missing data" });

    const cv = await CV.create({
      ...cvData,
      fileUrls: [pdfUrl],
      user_id: userId,
      status: "active",
    });

    await User.findByIdAndUpdate(userId, { $push: { cv: cv._id } });

    res.json({ cvId: cv._id, pdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all CVs of a user
exports.getCVsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cvs = await CV.find({ user_id: userId });
    res.json(cvs);
  } catch (err) {
    console.error("getCVsByUser error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all CVs
exports.getCVs = async (req, res) => {
  try {
    const cvs = await CV.find();
    res.json(cvs);
  } catch (err) {
    console.error("getCVsByUser error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all CVs of a user
exports.getCVById = async (req, res) => {
  try {
    const { Id } = req.params;
    const cv = await CV.findById(Id);
    if (!cv) return res.status(404).json({ error: "CV not found" });
    res.json(cv);
  } catch (err) {
    console.error("getCVById error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update CV
exports.updateCV = async (req, res) => {
  try {
    const { cvId } = req.params;
    const updateData = req.body;
    const cv = await CV.findByIdAndUpdate(cvId, updateData, { new: true });
    if (!cv) return res.status(404).json({ error: "CV not found" });
    res.json(cv);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete CV
exports.deleteCV = async (req, res) => {
  try {
    const { cvId } = req.params;

    const cv = await CV.findByIdAndDelete(cvId);
    if (!cv) return res.status(404).json({ error: "CV not found" });

    await User.findByIdAndUpdate(cv.user_id, { $pull: { cv: cv._id } });

    res.json({ message: "CV deleted" });
  } catch (err) {
    console.error("deleteCV error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.parseCVText = async (req, res) => {
  try {
    const { cvText } = req.body;

    if (!cvText) {
      return res.status(400).json({ success: false, message: "Không có nội dung text" });
    }

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    // 2. Khởi tạo Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      safetySettings: safetySettings,
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: `
        Bạn là một chuyên gia phân tích CV (Resume Parser).
        Nhiệm vụ của bạn là trích xuất thông tin từ văn bản thô (raw text) và trả về dữ liệu dạng JSON khớp chính xác với cấu trúc Mongoose Schema dưới đây.

        CẤU TRÚC JSON YÊU CẦU:
        {
          "name": "String (Tên ứng viên)",
          "introduction": "String (Tóm tắt/Summary)",
          "professionalSkills": "String (Các kỹ năng cứng, công nghệ, ngăn cách bằng dấu phẩy)",
          "softSkills": "String (Các kỹ năng mềm, ngăn cách bằng dấu phẩy)",
          "contact": {
            "phone": "String",
            "email": "String",
            "github": "String",
            "website": "String (Portfolio/LinkedIn)"
          },
          "education": [
            {
              "university": "String",
              "major": "String",
              "year": "String (Ví dụ: 2021 - 2025)",
              "gpa": "String (Nếu có)"
            }
          ],
          "experience": [
            {
              "jobTitle": "String",
              "company": "String",
              "startDate": "String",
              "endDate": "String",
              "description": "String"
            }
          ],
          "projects": [
            {
              "projectName": "String",
              "projectDescription": "String (Mô tả ngắn gọn về dự án. đưa cả link gihub hoặc tương tự nếu có)"
            }
          ],
          "status": "String (Giá trị mặc định là 'active')",
          "certifications": "String (Nếu có)",
          "activitiesAwards": "String (Nếu có)",
          "templateType": "Number (Mặc định là 0)",
        }

        QUY TẮC:
        1. Chỉ trả về JSON thuần túy.
        2. Nếu trường nào không tìm thấy thông tin, hãy để chuỗi rỗng "" hoặc mảng rỗng [].
        3. "professionalSkills" và "softSkills": liệt kê dạng chuỗi, ngăn cách bởi dấu phẩy.
        4. Hãy thông minh trong việc ghép nối các dòng bị ngắt quãng.
      `,
    });

    // 3. Logic Retry (Thử lại tối đa 3 lần nếu gặp lỗi)
    let parsedData = null;
    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(cvText);
        const response = result.response;
        const jsonText = response.text();
        parsedData = JSON.parse(jsonText);
      
        break; 
      } catch (e) {
        console.warn(`Lần thử ${attempt} thất bại:`, e.message);
        lastError = e;
        if (attempt < maxRetries) await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    if (!parsedData) {
        throw new Error(`Không thể phân tích CV sau ${maxRetries} lần thử. Lỗi cuối cùng: ${lastError?.message}`);
    }

    return res.status(200).json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error("AI Parse Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
