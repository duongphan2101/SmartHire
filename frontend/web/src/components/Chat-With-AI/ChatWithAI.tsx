import React, { useState } from "react";
import './ChatWithAI.css';
import icon from "../../assets/icons/Robot.png";
import { BsFillSendFill } from 'react-icons/bs';
import { useChatWithAI } from "../../hook/useChatWithAI";

const ChatWithAI: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { messages, sendMessage, loading } = useChatWithAI();

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="chat-with-ai-container">
      <div className="tooltip">Xin chào! Tôi có thể giúp gì cho bạn?</div>

      <button className="chat-ai-button" onClick={toggleChat}>
        <img src={icon} alt="AI Icon" className="ai-icon" />
      </button>

      {isChatOpen && (
        <div className="chat-box">
          <div className="chat-box-header">
            <span>SmartHire AI</span>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>

          <div className="chat-box-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "user" ? "message-user" : "message-ai"}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="message message-ai">...</div>}
          </div>

          <div className="chat-box-bottom flex justify-between">
            <input
              placeholder="Nhập nội dung ... "
              className="inputMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="btn-send" onClick={handleSend}>
              <BsFillSendFill size={24} color="#10b981" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithAI;
