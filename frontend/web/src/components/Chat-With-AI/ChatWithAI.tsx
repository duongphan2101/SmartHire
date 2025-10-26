import React, { useState, useRef, useEffect } from "react";
import './ChatWithAI.css';
import icon from "../../assets/icons/Robot.png";
import { BsFillSendFill } from 'react-icons/bs';
import { useChatWithAI } from "../../hook/useChatWithAI";

const ChatWithAI: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { messages, sendMessage, loading } = useChatWithAI();

  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="chat-with-ai-container">
      <div className="tooltip">Xin chào! Tôi có thể giúp gì cho bạn?</div>

      <button className="chat-ai-button" onClick={toggleChat}>
        <img src={icon} alt="AI Icon" className="ai-icon" />
      </button>

      {isChatOpen && (
        <div className="chat-box flex flex-col justify-between">
          <div className="chat-box-header">
            <span>SmartHire AI</span>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>

          <div className="chat-box-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === "user" ? "message-user" : "message-ai"}`}>
                {msg.text && <div>{msg.text}</div>}
                {msg.jobs && msg.jobs.length > 0 && (
                  <div className="chatbot-job-list">
                    {msg.jobs.map((job) => (
                      <div key={job.id} className="chatbot-job-item" onClick={() => window.open(`/jobdetail/${job.id}`, "_blank")}>
                        <strong>{job.title}</strong>
                        <p>{job.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="message message-ai">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-box-bottom flex items-center justify-between">

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
