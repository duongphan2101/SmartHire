const CV = require("../models/CV");
const User = require("../models/User");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const axios = require("axios");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cấu hình S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

const DICTIONARY = {
  vi: {
    SUMMARY: 'Mục tiêu nghề nghiệp',
    EXPERIENCE: 'Kinh nghiệm làm việc',
    PROJECTS: 'Dự án',
    EDUCATION: 'Học vấn',
    SKILLS: 'Kỹ năng',
    PROF_SKILLS: 'Chuyên môn:',
    SOFT_SKILLS: 'Kỹ năng mềm:',
    ACTIVITIES: 'Hoạt động khác',
    AT: 'tại',
    UNIVERSITY: 'Trường:',
    MAJOR: 'Chuyên ngành:',
    TIME: 'Thời gian:',
    GPA: 'GPA:'
  },
  en: {
    SUMMARY: 'Summary',
    EXPERIENCE: 'Work Experience',
    PROJECTS: 'Projects',
    EDUCATION: 'Education',
    SKILLS: 'Skills',
    PROF_SKILLS: 'Professional:',
    SOFT_SKILLS: 'Soft Skills:',
    ACTIVITIES: 'Activities',
    AT: 'at',
    UNIVERSITY: 'University:',
    MAJOR: 'Major:',
    TIME: 'Time:',
    GPA: 'GPA:'
  }
};

const getTemplateName = (type) => {
  switch (type) {
    case 2: return 'twocolumns'; // Tương ứng file templates/twocolumns.hbs
    case 3: return 'modern';     // Tương ứng file templates/modern.hbs
    default: return 'fresher';   // Tương ứng file templates/fresher.hbs (Mặc định)
  }
};

const compileTemplate = (templateName, data) => {
  const filePath = path.join(__dirname, `../templates/${templateName}.hbs`);
  // Kiểm tra file có tồn tại không để tránh crash
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template file not found: ${templateName}.hbs`);
  }
  const html = fs.readFileSync(filePath, 'utf-8');
  return handlebars.compile(html)(data);
};

const splitSkills = (skillsStr) => {
  if (!skillsStr) return [];
  try {
    const parsed = JSON.parse(skillsStr);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) { }
  return skillsStr.toString().split(',').map(s => s.trim()).filter(s => s);
};

const createPDF = async (cvData, settings, layoutOrder) => {
  let browser;

  try {
    // ------------------------------
    // 1. I18n + settings
    // ------------------------------
    const langCode = settings?.lang === "en" ? "en" : "vi";
    const i18n = DICTIONARY[langCode];

    const finalSettings = {
      color: settings?.color || cvData.color || "#059669",
      fontFamily: settings?.fontFamily || cvData.fontFamily || "Arial",
      lang: langCode,
    };

    const templateType = cvData.templateType || 1;
    const templateFileName = getTemplateName(templateType);

    const profSkillsArray = splitSkills(cvData.professionalSkills);
    const softSkillsArray = splitSkills(cvData.softSkills);

    // ------------------------------
    // 2. Sắp xếp layout section
    // ------------------------------
    const defaultOrder = [
      "SUMMARY",
      "EXPERIENCE",
      "PROJECTS",
      "EDUCATION",
      "SKILLS",
      "ACTIVITIES",
    ];

    const order = layoutOrder?.length > 0 ? layoutOrder : defaultOrder;

    const orderedSections = order
      .map((key) => {
        switch (key) {
          case "SUMMARY":
            return {
              type: "SUMMARY",
              title: i18n.SUMMARY,
              content: cvData.introduction,
              hasData: !!cvData.introduction,
            };

          case "EXPERIENCE":
            return {
              type: "EXPERIENCE",
              title: i18n.EXPERIENCE,
              items: cvData.experience,
              hasData: cvData.experience?.length > 0,
            };

          case "PROJECTS":
            return {
              type: "PROJECTS",
              title: i18n.PROJECTS,
              items: cvData.projects,
              hasData: cvData.projects?.length > 0,
            };

          case "EDUCATION":
            return {
              type: "EDUCATION",
              title: i18n.EDUCATION,
              items: cvData.education,
              hasData: cvData.education?.length > 0,
            };

          case "SKILLS":
            return {
              type: "SKILLS",
              title: i18n.SKILLS,
              profSkillsArray,
              softSkillsArray,
              hasData:
                profSkillsArray.length > 0 || softSkillsArray.length > 0,
            };

          case "ACTIVITIES":
            return {
              type: "ACTIVITIES",
              title: i18n.ACTIVITIES,
              content: cvData.activitiesAwards,
              hasData: !!cvData.activitiesAwards,
            };

          default:
            return null;
        }
      })
      .filter((sec) => sec?.hasData);

    // ------------------------------
    // 3. Generate HTML từ template
    // ------------------------------
    const content = compileTemplate(templateFileName, {
      ...cvData,
      settings: finalSettings,
      orderedSections,
      i18n,
    });

    // ------------------------------
    // 4. Puppeteer chạy Chromium trong Docker
    // ------------------------------
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // ★ BẮT BUỘC
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
        "--no-zygote",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(content, { waitUntil: "networkidle0" });

    // ------------------------------
    // 5. Xuất PDF
    // ------------------------------
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    });

    // ------------------------------
    // 6. Upload S3 → trả URL
    // ------------------------------
    const fileName = `cv-${cvData.user_id || "guest"}-${Date.now()}.pdf`;

    const s3Response = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: pdfBuffer,
        ContentType: "application/pdf",
        ACL: "public-read",
      })
      .promise();

    return s3Response.Location;

  } catch (error) {
    console.error("Puppeteer/S3 Error:", error);
    throw error;

  } finally {
    if (browser) await browser.close();
  }
};


exports.createCV = async (req, res) => {
  try {
    const { userId, cvData, settings, layout } = req.body;

    if (!userId || !cvData) return res.status(400).json({ error: "Missing data" });

    const pdfUrl = await createPDF({ ...cvData, user_id: userId }, settings, layout);

    const cv = await CV.create({
      ...cvData,
      fileUrls: [pdfUrl],
      user_id: userId,
      status: "active",
      templateType: cvData.templateType || 1,
      color: settings?.color || cvData.color,
      fontFamily: settings?.fontFamily || cvData.fontFamily,
      languageForCV: settings?.lang || cvData.languageForCV
    });

    await User.findByIdAndUpdate(userId, { $push: { cv: cv._id } });

    res.json({ success: true, cvId: cv._id, pdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.createCVParse = async (req, res) => {
  try {
    const { userId, cvData, pdfUrl } = req.body;

    if (!userId || !cvData) {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc (userId hoặc cvData)" });
    }
    const cv = await CV.create({
      ...cvData,
      user_id: userId,
      fileUrls: [pdfUrl],
      status: "active",
      templateType: 0,

      color: cvData.color || '#059669',
      fontFamily: cvData.fontFamily || 'Arial',
      languageForCV: cvData.languageForCV || 'vi'
    });

    await User.findByIdAndUpdate(userId, { $push: { cv: cv._id } });

    return res.status(200).json({ 
      success: true, 
      cvId: cv._id, 
      pdfUrl: pdfUrl 
    });

  } catch (err) {
    console.error("Error in createCVParse:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.updateCV = async (req, res) => {
  try {
    const { cvId } = req.params;
    const { newUrl, settings, layout, regeneratePDF, ...updateData } = req.body;

    const cv = await CV.findById(cvId);
    if (!cv) return res.status(404).json({ error: "CV không tồn tại" });

    Object.assign(cv, updateData);

    if (settings) {
      cv.color = settings.color;
      cv.fontFamily = settings.fontFamily;
      cv.languageForCV = settings.lang;
    }

    if (regeneratePDF || !newUrl) {
      const pdfUrl = await createPDF({ ...cv.toObject(), ...updateData }, settings, layout);
      cv.fileUrls = [pdfUrl];
    } else if (newUrl) {
      cv.fileUrls = [newUrl];
    }

    const updatedCV = await cv.save();
    res.status(200).json({ success: true, ...updatedCV.toObject(), pdfUrl: cv.fileUrls[0] });
  } catch (err) {
    console.error("Lỗi update CV:", err);
    res.status(500).json({ error: "Lỗi Server" });
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
          "templateType": 0,
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

    console.log("PARSE DATA: ", parsedData.templateType);

    return res.status(200).json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error("AI Parse Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateCV = async (req, res) => {
  try {
    const { cvId, jobId, feedback, currentCV } = req.body;

    // CASE 1: REFINING
    if (feedback && currentCV) {
      const refinedCV = await callAIRefine(currentCV, feedback);
      return res.status(200).json({
        success: true,
        mode: "refine",
        refinedCV
      });
    }

    // CASE 2: FIRST TIME TAILORING
    if (!cvId || !jobId) {
      return res.status(400).json({ error: "cvId và jobId là bắt buộc khi tailor lần đầu." });
    }

    const baseCV = await CV.findById(cvId).lean();
    if (!baseCV) return res.status(404).json({ error: "Không tìm thấy CV." });

    const jobServiceUrl = `${process.env.JOB_SERVICE_URL}/${jobId}`;
    const jobRes = await axios.get(jobServiceUrl);
    const jobData = jobRes.data?.data || jobRes.data;

    if (!jobData) return res.status(404).json({ error: "Không tìm thấy job." });

    const tailoredCV = await callAITailor(baseCV, jobData);

    return res.status(200).json({
      success: true,
      mode: "tailor",
      originalCV: baseCV,
      tailoredCV,
      job: jobData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

async function callAITailor(baseCV, jobData) {
  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
  ];

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    safetySettings,
    generationConfig: {
      responseMimeType: "application/json",
    },
    systemInstruction: `
      Bạn là chuyên gia tối ưu CV theo JD.

      Nhiệm vụ:
      - Nhận baseCV và jobData.
      - Tái cấu trúc nội dung CV sao cho phù hợp nhất với job:
        + Nhấn mạnh kỹ năng trùng khớp.
        + Điều chỉnh introduction (summary) ngắn gọn, đánh trúng JD.
        + Reword lại kinh nghiệm để phù hợp job (nhưng không bịa đặt).
        + Highlight project nào liên quan trực tiếp đến job.
        + Sắp xếp thứ tự ưu tiên: skills liên quan → experience mạnh → project phù hợp.

      QUY TẮC:
      1. Chỉ trả về JSON đúng schema CV của hệ thống:
      {
        "name": "String",
        "title": "String" (Vị trí mà trong jd tuyển),
        "introduction": "String",
        "professionalSkills": "String",
        "softSkills": "String",
        "contact": {
          "phone": "String",
          "email": "String",
          "github": "String",
          "website": "String"
        },
        "education": [...],
        "experience": [...],
        "projects": [...],
        "status": "active",
        "certifications": "String",
        "activitiesAwards": "String",
        "templateType": 1,
        "color": "String",
        "fontFamily":"String",
        "languageForCV":"String"
      }
      2. Không bịa kinh nghiệm.
      3. Không đổi dữ liệu contact, education trừ khi cần format lại.
      4. Những phần không liên quan thì tinh gọn, không xoá.
    `,
  });

  const maxRetries = 3;
  let lastError = null;

  const prompt = `
      Base CV:
      ${JSON.stringify(baseCV)}

      Job Detail:
      ${JSON.stringify(jobData)}

      Hãy tailor CV này sao cho phù hợp nhất với job.
  `;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const jsonText = result.response.text();
      return JSON.parse(jsonText);
    } catch (err) {
      console.warn(`Tailor attempt ${attempt} failed:`, err.message);
      lastError = err;

      if (attempt < maxRetries) {
        await new Promise(res => setTimeout(res, 1000 * attempt));
      }
    }
  }

  throw new Error(`AI Tailor failed after ${maxRetries} attempts: ${lastError?.message}`);
}

async function callAIRefine(currentCV, feedback) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    systemInstruction: `
      Bạn là chuyên gia chỉnh sửa CV.

      - Giữ nguyên toàn bộ dữ liệu gốc.
      - Chỉ sửa những phần liên quan đến feedback người dùng.
      - Không sáng tạo kinh nghiệm mới.
      - Trả về JSON full schema CV.
    `
  });

  const prompt = `
    Current CV:
    ${JSON.stringify(currentCV)}

    Feedback:
    "${feedback}"

    Hãy refinine CV theo đúng yêu cầu người dùng.
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}


