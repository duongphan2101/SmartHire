import React, { useState } from "react";
import './ChatWithAI.css';
import icon from "../../assets/icons/Robot.png";

const ChatWithAI: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
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
                        <p>Xin chào! Tôi là trợ lý AI. Hãy hỏi tôi điều gì đó.</p>
                        {/* Sau này có thể thêm input/chat history ở đây */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWithAI;
