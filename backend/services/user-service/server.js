require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 2222;

// Middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cvs", require("./routes/cvRoutes"));
app.use("/api/terms", require("./routes/termsRoutes"))

app.listen(PORT, "0.0.0.0", () => console.log(`🚀 User service running on port ${PORT}`));
