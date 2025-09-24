import { pipeline } from "@xenova/transformers";

let embedder;

// Khởi tạo model HuggingFace
export async function initEmbedding() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ HuggingFace model loaded");
  }
}

// Hàm lấy embedding
export async function getEmbedding(text) {
  if (!embedder) {
    await initEmbedding();
  }
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}
