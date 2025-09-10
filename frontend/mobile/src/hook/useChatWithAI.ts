import { useState } from "react";
import axios from "axios";
import { HOSTS } from "../utils/host";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export function useChatWithAI() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Xin chào! Tôi là trợ lý AI của SmartHire." }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // thêm message của user
    setMessages(prev => [...prev, { sender: "user", text: message }]);
    setLoading(true);

    try {
        const host = HOSTS.chatbotService;
      const res = await axios.post(`${host}`, {
        message,
      });

      const reply = res.data.reply || "Xin lỗi, tôi chưa hiểu ý bạn.";
      setMessages(prev => [...prev, { sender: "ai", text: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "Lỗi kết nối đến chatbot. Vui lòng thử lại." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}
