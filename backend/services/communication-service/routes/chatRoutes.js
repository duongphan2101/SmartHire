const express = require("express");
const router = express.Router();
const {
  // ChatRoom
  createChatRoom,
  getChatRoomsByUser,
  deleteChatRoom,
  // Chat
  getMessages,
  sendMessage,
  // ChatRequest
  sendChatRequest,
  acceptChatRequest,
  rejectChatRequest,
  getChatRequests,
} = require("../controllers/chatController");

// ================= ChatRoom =================
// Tạo chat room (HR)
router.post("/room", createChatRoom);

// Lấy tất cả chat room của user
router.get("/room/user/:userId", getChatRoomsByUser);

// Xóa chat room
router.delete("/room/:chatRoomId", deleteChatRoom);

// ================= Chat =================
// Lấy tin nhắn trong room
router.get("/messages/:chatRoomId", getMessages);

// Gửi tin nhắn
router.post("/messages/:chatRoomId", sendMessage);

// ================= ChatRequest =================
// Gửi yêu cầu chat từ HR tới candidate
router.post("/request", sendChatRequest);

// Candidate chấp nhận request → tạo chat room
router.put("/request/:requestId/accept", acceptChatRequest);

// Candidate từ chối request
router.put("/request/:requestId/reject", rejectChatRequest);

// Lấy tất cả request cho candidate
router.get("/request/:candidateId", getChatRequests);

module.exports = router;
