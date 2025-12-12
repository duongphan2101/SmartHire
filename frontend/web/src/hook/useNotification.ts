import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

export interface Notification {
  _id: string;
  receiverId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  requestId: string;
  createdAt: string;
}

type CreateNotificationPayload = Pick<
  Notification,
  "receiverId" | "type" | "title" | "message" | "requestId"
>;

type ApiError = {
  message?: string;
};

const NOTIFICATION_API_HOST =
  HOSTS.notificationService || "http://localhost:7000/api/notifications";
// const SOCKET_HOST = HOSTS.socket || "http://localhost:7000";

export default function useNotification(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown, defaultMessage: string) => {
    const axiosErr = err as AxiosError<ApiError>;
    const message = axiosErr.response?.data?.message || defaultMessage;
    setError(message);
    throw new Error(message);
  };

  const fetchNotifications = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Notification[]>(
        `${NOTIFICATION_API_HOST}/receiver/${id}`
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Không thể tải thông báo cũ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetchNotifications(userId);

    const newSocket = io("http://52.76.22.144", {
      path: "/socket.io",
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join", userId);
    });

    newSocket.on("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, fetchNotifications]);

  const createNotification = async (data: CreateNotificationPayload) => {
    try {
      const res = await axios.post<Notification>(
        `${NOTIFICATION_API_HOST}/create`,
        data
      );

      return res.data;
    } catch (err) {

      return handleError(err, "Không thể tạo thông báo");
    }
  };

  return {
    notifications,
    setNotifications,
    socket,
    createNotification,
    loading,
    error,
    fetchNotifications,
  };
}