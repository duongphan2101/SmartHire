require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// Cấu hình socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware cors cho express
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());

// Attach io vào request để controller dùng
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Kết nối DB
connectDB();

// Routes
app.use("/api/notifications", require("./routes/notificationRoutes"));

// socket.io handle
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // user join room = userId để nhận thông báo riêng
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`📩 User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () =>
  console.log(`🚀 Notification service running on port ${PORT}`)
);
