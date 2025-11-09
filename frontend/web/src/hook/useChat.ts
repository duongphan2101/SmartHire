import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import type { ChatMessage, ChatRequest, ChatRoom } from "../utils/interfaces";
import { HOSTS } from "../utils/host";

const SOCKET_URL = HOSTS.chat_socket;
const API_URL = HOSTS.chatService;

export const useChat = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [userId, setUserId] = useState<string>("");
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
    const currentRoomIdRef = useRef<string | null>(null);
    // ==== Load userId từ localStorage ====
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const id = parsed.user_id ?? parsed._id;
                setUserId(id);
            }
        } catch (e) {
            console.error("Invalid user data in localStorage", e);
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        const s: Socket = io(SOCKET_URL, {
            query: { userId }
        });
        setSocket(s);
        console.log("🔌 Socket connecting...");

        s.on("connect", () => console.log("🔌 Socket connected:", s.id));
        s.on("disconnect", () => console.log("Socket disconnected"));

        // Cleanup khi component unmount
        return () => {
            s.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg: ChatMessage & { chatRoomId: string }) => {
            setRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room._id === msg.chatRoomId
                        ? { ...room, lastMessage: msg.message }
                        : room
                )
            );
            if (msg.chatRoomId === currentRoomIdRef.current) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket]);

    // ==== ChatRoom CRUD ====
    const fetchRooms = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await axios.get<ChatRoom[]>(`${API_URL}/room/user/${userId}`);
            setRooms(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [userId]);

    const createChatRoom = async (jobId: string, members: string[]) => {
        try {
            console.log("data: JobId: " + jobId + " members: " + members);
            console.log(`${API_URL}/room`)
            const res = await axios.post<ChatRoom>(`${API_URL}/room`, { jobId, members });
            setRooms((prev) => [...prev, res.data]);
            return res.data;
        } catch (err) {
            console.error(err);
        }
    };

    const deleteChatRoom = async (chatRoomId: string) => {
        try {
            await axios.delete(`${API_URL}/room/${chatRoomId}`);
            setRooms((prev) => prev.filter((r) => r._id !== chatRoomId));
            if (currentRoomId === chatRoomId) setCurrentRoomId(null);
        } catch (err) {
            console.error(err);
        }
    };

    // ==== Chat CRUD ====
    const fetchMessages = useCallback(
        async (roomId: string) => {
            try {
                const res = await axios.get<ChatMessage[]>(`${API_URL}/messages/${roomId}`);
                setMessages(res.data);
                setCurrentRoomId(roomId);
                currentRoomIdRef.current = roomId;
                socket?.emit("joinRoom", roomId);
            } catch (err) {
                console.error(err);
            }
        },
        [socket]
    );

    const sendMessage = useCallback(
        (
            roomId: string,
            message: string,
            messageType: "text" | "file" | "system" = "text"
        ) => {
            if (!socket || !userId) {
                console.error("Socket or UserID not available");
                return;
            }

            socket.emit("sendMessage", {
                chatRoomId: roomId,
                senderId: userId,
                message,
                messageType,
            });

        },
        [socket, userId]
    );

    // ==== ChatRequest CRUD ====
    const fetchChatRequests = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await axios.get<ChatRequest[]>(`${API_URL}/request/${userId}`);
            setChatRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [userId]);

    const sendChatRequest = async (hrId: string, candidateId: string, jobId: string) => {
        try {
            const res = await axios.post<ChatRequest>(`${API_URL}/request`, { hrId, candidateId, jobId });
            setChatRequests((prev) => [...prev, res.data]);
            return res.data;
        } catch (err) {
            console.error(err);
        }
    };

    const acceptChatRequest = async (requestId: string) => {
        try {
            const res = await axios.put<{ msg: string; room: ChatRoom }>(
                `${API_URL}/request/${requestId}/accept`
            );
            fetchRooms();
            setChatRequests((prev) =>
                prev.map((r) => (r._id === requestId ? { ...r, status: "accepted" } : r))
            );
            return res.data.room;
        } catch (err) {
            console.error(err);
        }
    };

    const rejectChatRequest = async (requestId: string) => {
        try {
            await axios.put(`${API_URL}/request/${requestId}/reject`);
            setChatRequests((prev) =>
                prev.map((r) => (r._id === requestId ? { ...r, status: "rejected" } : r))
            );
        } catch (err) {
            console.error(err);
        }
    };

    return {
        rooms,
        messages,
        chatRequests,
        currentRoomId,
        fetchRooms,
        createChatRoom,
        deleteChatRoom,
        fetchMessages,
        sendMessage,
        fetchChatRequests,
        sendChatRequest,
        acceptChatRequest,
        rejectChatRequest,
        socket
    };
};
