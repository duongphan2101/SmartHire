const CV = require("../models/CV");
const User = require("../models/User");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

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

const compileTemplate = (data) => {
    const filePath = path.join(__dirname, '../templates/cv_template.hbs');
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
        const langCode = settings?.lang === 'en' ? 'en' : 'vi';
        const i18n = DICTIONARY[langCode];

        const finalSettings = {
            color: settings?.color || cvData.color || '#059669',
            fontFamily: settings?.fontFamily || cvData.fontFamily || 'Arial',
            lang: langCode
        };

        const profSkillsArray = splitSkills(cvData.professionalSkills);
        const softSkillsArray = splitSkills(cvData.softSkills);

        const defaultOrder = ['SUMMARY', 'EXPERIENCE', 'PROJECTS', 'EDUCATION', 'SKILLS', 'ACTIVITIES'];
        const order = layoutOrder && layoutOrder.length > 0 ? layoutOrder : defaultOrder;

        const orderedSections = order.map(sectionKey => {
            switch (sectionKey) {
                case 'SUMMARY':
                    return {
                        type: 'SUMMARY',
                        title: i18n.SUMMARY,
                        content: cvData.introduction,
                        hasData: !!cvData.introduction
                    };
                case 'EXPERIENCE':
                    return {
                        type: 'EXPERIENCE',
                        title: i18n.EXPERIENCE,
                        items: cvData.experience,
                        hasData: cvData.experience?.length > 0
                    };
                case 'PROJECTS':
                    return {
                        type: 'PROJECTS',
                        title: i18n.PROJECTS,
                        items: cvData.projects,
                        hasData: cvData.projects?.length > 0
                    };
                case 'EDUCATION':
                    return {
                        type: 'EDUCATION',
                        title: i18n.EDUCATION,
                        items: cvData.education,
                        hasData: cvData.education?.length > 0
                    };
                case 'SKILLS':
                    return {
                        type: 'SKILLS',
                        title: i18n.SKILLS,
                        profSkillsArray: profSkillsArray,
                        softSkillsArray: softSkillsArray,
                        hasData: profSkillsArray.length > 0 || softSkillsArray.length > 0
                    };
                case 'ACTIVITIES':
                    return {
                        type: 'ACTIVITIES',
                        title: i18n.ACTIVITIES,
                        content: cvData.activitiesAwards,
                        hasData: !!cvData.activitiesAwards
                    };
                default:
                    return null;
            }
        }).filter(section => section && section.hasData);

        const content = compileTemplate({
            ...cvData,
            settings: finalSettings,
            orderedSections,
            i18n
        });

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setContent(content, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
        });

        const fileName = `cv-${cvData.user_id || 'guest'}-${Date.now()}.pdf`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
            ACL: 'public-read'
        };

        const s3Response = await s3.upload(uploadParams).promise();
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
