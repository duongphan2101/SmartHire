// server.js
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const matchRoutes = require("./routes/matchRoutes");
const { initEmbedding } = require("./services/embeddingService");

// Load env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Khởi tạo embedding
initEmbedding().then(() => {
  console.log("✅ Embedding service initialized");

  // Routes
  app.use("/api/matching", matchRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT,"0.0.0.0", () => console.log(`🚀 Matching service running on port ${PORT}`));
}).catch(err => {
  console.error("❌ Failed to initialize embedding:", err);
  process.exit(1);
});
