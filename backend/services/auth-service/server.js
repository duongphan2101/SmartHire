require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});


app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.listen(PORT, () => console.log(`🚀 Auth service running on port ${PORT}`));
