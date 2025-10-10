// hook/useNotification.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface Notification {
  _id: string;
  receiverId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function useNotification(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // ✅ Quan trọng: để Socket.IO tự chọn transport
    const newSocket = io("http://localhost:7000", {
      withCredentials: true,
      transports: ["websocket", "polling"], // để socket.io tự fallback
    });

    setSocket(newSocket);

    // Join room theo userId
    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
      newSocket.emit("join", userId);
    });

    // Lắng nghe thông báo từ server
    newSocket.on("new-notification", (notification: Notification) => {
      console.log("📩 Nhận thông báo:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return { notifications, setNotifications, socket };
}
