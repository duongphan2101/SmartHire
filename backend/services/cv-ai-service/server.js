const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cvAIRoutes = require("./routes/cvaiRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/cvai", cvAIRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`CV-AI service running on port ${PORT}`);
});
