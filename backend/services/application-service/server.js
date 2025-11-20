const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
dotenv.config();
connectDB();

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/applications", require("./routes/applicationRoutes"));

const PORT = process.env.PORT;

app.listen(PORT,"0.0.0.0", () => {
  console.log(`✅ Application Service running on port ${PORT}`);
});
