const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const {
  initSocket,
} = require("./controllers/chatController");
dotenv.config();
connectDB();

require("./utils/interviewScheduler");

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
initSocket(io);
// Routes
const interviewRoutes = require("./routes/interviewRoutes");
const chatRoutes = require("./routes/chatRoutes");
app.use("/api/interviews", interviewRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 1000;

server.listen(PORT,"0.0.0.0", () => {
  console.log(`✅ Server (API & Socket) running on port ${PORT}`);
});

