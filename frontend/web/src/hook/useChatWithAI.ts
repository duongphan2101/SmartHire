import { useState } from "react";
import axios from "axios";
import { HOSTS } from "../utils/host";

interface Job {
  id: string;
  title: string;
  location: string;
}

interface Message {
  sender: "user" | "ai";
  text?: string;
  jobs?: Job[];
}

export function useChatWithAI() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Xin chào! Tôi là trợ lý AI của SmartHire." }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // thêm message của user vào danh sách
    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setLoading(true);

    try {
      const host = HOSTS.chatbotService;
      const res = await axios.post(`${host}`, { message });

      const reply = res.data.reply || "Xin lỗi, tôi chưa hiểu ý bạn.";
      const jobs = Array.isArray(res.data.jobs) ? res.data.jobs : [];

      // thêm phản hồi của AI (text + job list nếu có)
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: reply, ...(jobs.length > 0 && { jobs }) },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Lỗi kết nối đến chatbot. Vui lòng thử lại." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}
