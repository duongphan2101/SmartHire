import React, { useState } from "react";
import './ChatWithAI.css';
import icon from "../../assets/icons/Robot.png";
import { BsFillSendFill } from 'react-icons/bs';

interface Message {
  sender: "user" | "ai";
  text: string;
}

const ChatWithAI: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Xin chào! Tôi là trợ lý AI của SmartHire." },
    { sender: "user", text: "Chào AI! Giúp tôi tìm việc frontend nhé." },
    { sender: "ai", text: "Tuyệt! Bạn muốn làm ở thành phố nào?" },
  ]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessages: Message[] = [...messages, { sender: "user", text: message }];

    setMessages(newMessages);
    setMessage("");

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: `AI trả lời: "${message}"` }
      ]);
    }, 1000);
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
