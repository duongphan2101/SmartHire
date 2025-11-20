// --- CONFIGURATION ---
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Lấy API Key từ môi trường
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL = "text-embedding-004";

// Khởi tạo client
// Lưu ý: Đây là bước 1, chưa tạo model
const genAI = new GoogleGenerativeAI(apiKey);

// Trạng thái init
let isInitialized = false;

// --- INITIALIZATION ---
async function initEmbedding() {
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY/GOOGLE_API_KEY is missing.");
    return;
  }
  isInitialized = true;
  console.log("✅ Gemini Embedding API initialized.");
}

// --- CORE FUNCTIONALITY ---
async function getEmbedding(text) {
  if (!isInitialized) {
    await initEmbedding();
  }

  if (!apiKey) {
    throw new Error("Cannot get embedding: API Key missing.");
  }

  try {
    // BƯỚC QUAN TRỌNG: Lấy model từ client
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

    // Gọi hàm embedContent TỪ MODEL (không phải từ genAI)
    const result = await model.embedContent(text);
    
    const embedding = result.embedding;

    if (!embedding || !embedding.values) {
      throw new Error("Invalid response from Gemini Embedding API.");
    }

    return embedding.values;

  } catch (err) {
    console.error("❌ Gemini Embedding API Error:", err.message);
    throw new Error("Embedding failed: " + err.message);
  }
}

module.exports = { initEmbedding, getEmbedding };