const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const chatbotRoutes = require("./routes/chatbotRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Chatbot service running on port ${PORT}`);
});
