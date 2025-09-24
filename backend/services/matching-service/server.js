import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import matchRoutes from "./routes/matchRoutes.js";
import { initEmbedding } from "./services/embeddingService.js";

// Middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();
await initEmbedding();

app.use("/api/matching", matchRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Matching service running on port ${PORT}`));
