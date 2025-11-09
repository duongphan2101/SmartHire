const ChatRoom = require("../models/ChatRoom");
const ChatRequest = require("../models/chatRequest");
let io;

const initSocket = (socketIoInstance) => {
  io = socketIoInstance;

  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    socket.on("joinRoom", (chatRoomId) => {
      socket.join(chatRoomId);
      console.log(`🟢 ${socket.id} joined room ${chatRoomId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { chatRoomId, senderId, message, messageType = "text" } = data;
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) return;

        const newMsg = {
          senderId,
          message,
          messageType,
          createdAt: new Date(),
        };

        chatRoom.chats.push(newMsg);
        chatRoom.lastMessage = message;
        await chatRoom.save();

        const savedMsg = chatRoom.chats[chatRoom.chats.length - 1];

        io.to(chatRoomId).emit("newMessage", {
          ...savedMsg.toObject(),
          chatRoomId: chatRoomId
        });

      } catch (err) {
        console.error("Socket sendMessage error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
};

//
// =================== CHAT ROOM ===================
//

// HR tạo room
const createChatRoom = async (req, res) => {
  try {
    const { jobId, members } = req.body;

    if (!jobId || !members || members.length !== 2) {
      return res.status(400).json({ msg: "Invalid data" });
    }

    const exist = await ChatRoom.findOne({
      jobId,
      members: { $all: members },
    });
    if (exist) return res.status(200).json(exist);

    const newRoom = await ChatRoom.create({ jobId, members, chats: [] });
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getChatRoomsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const rooms = await ChatRoom.find({ members: userId }).sort({
      updatedAt: -1,
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteChatRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    await ChatRoom.findByIdAndDelete(chatRoomId);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//
// =================== CHAT CRUD ===================
//
const getMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const room = await ChatRoom.findById(chatRoomId).select("chats");
    if (!room) return res.status(404).json({ msg: "Room not found" });
    res.json(room.chats);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// const sendMessage = async (req, res) => {
//   try {
//     const { chatRoomId } = req.params;
//     const { senderId, message, messageType = "text" } = req.body;

//     const chatRoom = await ChatRoom.findById(chatRoomId);
//     if (!chatRoom) return res.status(404).json({ msg: "Room not found" });

//     const newMsg = {
//       senderId,
//       message,
//       messageType,
//       createdAt: new Date(),
//     };

//     chatRoom.chats.push(newMsg);
//     chatRoom.lastMessage = message;
//     await chatRoom.save();

//     io?.to(chatRoomId).emit("newMessage", newMsg);
//     res.status(201).json(newMsg);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

//
// =================== CHAT REQUEST ===================
//
const sendChatRequest = async (req, res) => {
  try {
    const { hrId, candidateId, jobId } = req.body;

    const exist = await ChatRequest.findOne({
      hrId,
      candidateId,
      jobId,
      status: { $in: ["pending", "accepted"] },
    });
    if (exist) return res.json(exist);

    const newRequest = await ChatRequest.create({
      hrId,
      candidateId,
      jobId,
      status: "pending",
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const acceptChatRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await ChatRequest.findById(requestId);
    if (!request) return res.status(404).json({ msg: "Not found" });

    request.status = "accepted";
    await request.save();

    const newRoom = await ChatRoom.create({
      jobId: request.jobId,
      members: [request.hrId, request.candidateId],
    });

    res.json({ msg: "Accepted", room: newRoom });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const rejectChatRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await ChatRequest.findById(requestId);
    if (!request) return res.status(404).json({ msg: "Not found" });

    request.status = "rejected";
    await request.save();
    res.json({ msg: "Rejected" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getChatRequests = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const requests = await ChatRequest.find({ candidateId });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  initSocket,
  createChatRoom,
  getChatRoomsByUser,
  deleteChatRoom,
  getMessages,
  // sendMessage,
  sendChatRequest,
  acceptChatRequest,
  rejectChatRequest,
  getChatRequests,
};
