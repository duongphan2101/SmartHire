// services/embeddingService.js (CommonJS + dynamic import)
let embedder;

async function initEmbedding() {
  if (!embedder) {
    const { pipeline } = await import("@xenova/transformers"); // dynamic import
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ HuggingFace model loaded");
  }
}

async function getEmbedding(text) {
  if (!embedder) {
    await initEmbedding();
  }
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

module.exports = { initEmbedding, getEmbedding };
