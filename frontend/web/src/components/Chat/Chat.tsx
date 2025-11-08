import React, { useState, useRef, useEffect } from "react";
import './Chat.css';
import { BsFillSendFill } from 'react-icons/bs';
import { AiOutlineComment, AiOutlineUser } from "react-icons/ai";

interface HRProfile {
  id: string;
  name: string;
  company: string;
  avatarUrl?: string;
}

interface Message {
  id: number;
  sender: "user" | "hr";
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  hr: HRProfile;
  messages: Message[];
  unreadCount: number;
}

const useMockChatSystem = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv1",
      hr: { id: "hr1", name: "Nguyễn Văn A", company: "SmartHire" },
      messages: [
        { id: 1, sender: "hr", text: "Chào em, anh thấy CV của em rất phù hợp.", timestamp: "10:30 AM" },
        { id: 2, sender: "user", text: "Dạ vâng, em cảm ơn anh ạ.", timestamp: "10:31 AM" },
      ],
      unreadCount: 1,
    },
    {
      id: "conv2",
      hr: { id: "hr2", name: "Lê Thị B", company: "Google (Việt Nam)" },
      messages: [
        { id: 1, sender: "hr", text: "Lịch phỏng vấn của em là 9:00 sáng mai nhé.", timestamp: "Hôm qua" },
      ],
      unreadCount: 0,
    },
    {
      id: "conv3",
      hr: { id: "hr3", name: "Trần C", company: "VNG Corporation" },
      messages: [
        { id: 1, sender: "user", text: "Em chào chị, em muốn hỏi về vị trí...", timestamp: "2 ngày trước" },
      ],
      unreadCount: 0,
    },
    {
      id: "conv4",
      hr: { id: "hr1", name: "Nguyễn Văn A", company: "SmartHire" },
      messages: [
        { id: 1, sender: "hr", text: "Chào em, anh thấy CV của em rất phù hợp.", timestamp: "10:30 AM" },
        { id: 2, sender: "user", text: "Dạ vâng, em cảm ơn anh ạ.", timestamp: "10:31 AM" },
      ],
      unreadCount: 1,
    },
    {
      id: "conv5",
      hr: { id: "hr2", name: "Lê Thị B", company: "Google (Việt Nam)" },
      messages: [
        { id: 1, sender: "hr", text: "Lịch phỏng vấn của em là 9:00 sáng mai nhé.", timestamp: "Hôm qua" },
      ],
      unreadCount: 0,
    },
    {
      id: "conv6",
      hr: { id: "hr3", name: "Trần C", company: "VNG Corporation" },
      messages: [
        { id: 1, sender: "user", text: "Em chào chị, em muốn hỏi về vị trí...", timestamp: "2 ngày trước" },
      ],
      unreadCount: 0,
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>("conv1"); // Chọn conv1 làm mặc định

  // Lấy ra cuộc trò chuyện đang được chọn
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  // Gửi tin nhắn
  const sendMessage = (text: string) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "user", // Người gửi luôn là "user" (ứng viên)
      text: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    // Cập nhật state
    setConversations(prevConvs =>
      prevConvs.map(conv => {
        if (conv.id === activeConversationId) {
          return { ...conv, messages: [...conv.messages, newMessage] };
        }
        return conv;
      })
    );

    // Giả lập HR trả lời
    setLoading(true);
    setTimeout(() => {
      const hrResponse: Message = {
        id: Date.now() + 1,
        sender: "hr",
        text: "HR đang bận, sẽ trả lời bạn sau.",
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prevConvs =>
        prevConvs.map(conv => {
          if (conv.id === activeConversationId) {
            return { ...conv, messages: [...conv.messages, hrResponse] };
          }
          return conv;
        })
      );
      setLoading(false);

    }, 1500);
  };

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    loading
  };
};

// --- Hết Mock Hook ---


const Chat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");

  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    loading
  } = useMockChatSystem();

  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSend = () => {
    if (!message.trim() || loading || !activeConversation) return;
    sendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, loading]); // Trigger khi tin nhắn của cuộc trò chuyện đang active thay đổi

  // Lấy tin nhắn cuối cùng để hiển thị preview
  const getLastMessage = (conv: Conversation) => {
    return conv.messages[conv.messages.length - 1]?.text || "Chưa có tin nhắn";
  };

  return (
    <div className="chat-widget">

      {!isChatOpen && (
        <div className="chat-widget__tooltip">
          Tin nhắn của bạn
        </div>
      )}

      {/* Nút bấm mở chat */}
      <button className="chat-widget__toggle-button" onClick={toggleChat} aria-label="Mở tin nhắn">
        <AiOutlineComment size={30} color="white"/>
      </button>

      {/* Cửa sổ chat (giờ là 2 cột) */}
      {isChatOpen && (
        <div className="chat-widget__window" style={{ width: "700px", height: "500px" }}>

          {/* ----- CỘT BÊN TRÁI (Sidebar) ----- */}
          <div className="chat-widget__sidebar">
            <div className="chat-widget__sidebar-header">
              <h3>Tin nhắn</h3>
            </div>
            <div className="conversation-list">
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  className={`conversation-item ${conv.id === activeConversationId ? 'selected' : ''}`}
                  onClick={() => setActiveConversationId(conv.id)}
                >
                  <div className="conversation-item__avatar">
                    <AiOutlineUser size={24} />
                  </div>
                  <div className="conversation-item__details">
                    <strong>{conv.hr.name}</strong>
                    <span>{conv.hr.company}</span>
                    <p>{getLastMessage(conv)}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="conversation-item__unread">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ----- CỘT BÊN PHẢI (Main Chat) ----- */}
          <div className="chat-widget__main">
            {!activeConversation ? (
              // Trạng thái khi chưa chọn cuộc trò chuyện
              <div className="chat-widget__empty">
                <p>Hãy chọn một cuộc trò chuyện để bắt đầu.</p>
              </div>
            ) : (
              // Trạng thái khi đã chọn
              <>
                <div className="chat-widget__header">
                  <span className="chat-widget__header-title">
                    {activeConversation.hr.name}
                  </span>
                  <button className="chat-widget__close-button" onClick={toggleChat} aria-label="Đóng cửa sổ chat">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <div className="chat-widget__body" ref={chatBodyRef}>
                  {activeConversation.messages.map((msg, index) => (
                    <div key={msg.id || index} className={`message-message ${msg.sender === "user" ? "message--user" : "message--hr"}`}>
                      {msg.text && <div>{msg.text}</div>}
                      <span className="message__timestamp">{msg.timestamp}</span>
                    </div>
                  ))}

                  {loading && (
                    <div className="message-message message--hr">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="chat-widget__input-area">
                  <input
                    placeholder="Nhập nội dung ... "
                    className="chat-widget__input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  />
                  <button
                    className="chat-widget__send-button"
                    onClick={handleSend}
                    disabled={loading}
                  >
                    <BsFillSendFill size={24} color="#10b981" />
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Chat;