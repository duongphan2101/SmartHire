import React, { useState, useRef, useEffect } from "react";
import './Chat.css';
import { BsFillSendFill } from 'react-icons/bs';
import { AiOutlineUser } from "react-icons/ai";
import { useChat } from "../../hook/useChat";
import useUser from "../../hook/useUser";
import useJob from "../../hook/useJob";
import type { ChatRoom, ChatMessage } from "../../utils/interfaces";
import type { UserResponse } from "../../hook/useUser";
import type { Job } from "../../hook/useJob";
import { Empty } from "antd";
import { AiOutlineClose } from "react-icons/ai";

interface ChatModalProps {
  room: ChatRoom | null;
  onClose: () => void;
}

const userCache = new Map<string, UserResponse>();
const jobCache = new Map<string, Job>();

const ChatModal: React.FC<ChatModalProps> = ({ room, onClose }) => {
  const [message, setMessage] = useState("");
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [memberDetails, setMemberDetails] = useState<Map<string, UserResponse>>(userCache);
  const [jobDetails, setJobDetails] = useState<Map<string, Job>>(jobCache);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser._id || currentUser.user_id;

  const {
    rooms,
    messages,
    currentRoomId,
    fetchRooms,
    fetchMessages,
    sendMessage
  } = useChat();

  const { getUser } = useUser();
  const { getJobById } = useJob();

  const getOtherMemberId = (chatRoom: ChatRoom): string => {
    if (!chatRoom.members) return "Unknown";
    const otherId = chatRoom.members.find((id: string) => id !== currentUserId);
    return otherId || "Unknown User";
  };

  const handleSelectRoom = async (roomId: string) => {
    if (roomId === currentRoomId) return;
    setIsLoadingMessages(true);
    await fetchMessages(roomId);
    setIsLoadingMessages(false);
  };

  useEffect(() => {
    fetchRooms();
    if (room?._id) {
      handleSelectRoom(room._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchRooms, room]);

  useEffect(() => {
    if (rooms.length === 0) return;

    const fetchMemberDetails = async () => {
      if (!getUser) return;
      const newDetailsMap = new Map(memberDetails);
      const idsToFetch = new Set<string>();

      for (const r of rooms) {
        const otherMemberId = getOtherMemberId(r);
        if (otherMemberId !== "Unknown User" && !newDetailsMap.has(otherMemberId)) {
          idsToFetch.add(otherMemberId);
        }
      }
      if (idsToFetch.size === 0) return;

      try {
        const promises = Array.from(idsToFetch).map(id => getUser(id));
        const results = await Promise.all(promises);
        results.forEach(user => {
          if (user) newDetailsMap.set(user._id, user);
        });

        setMemberDetails(newDetailsMap);

        newDetailsMap.forEach((value, key) => {
          userCache.set(key, value);
        });

      } catch (err) { console.error("Lỗi fetch user details:", err); }
    };

    const fetchJobDetails = async () => {
      if (!getJobById) return;
      const newDetailsMap = new Map(jobDetails);
      const idsToFetch = new Set<string>();

      for (const r of rooms) {
        if (r.jobId && !newDetailsMap.has(r.jobId)) {
          idsToFetch.add(r.jobId);
        }
      }
      if (idsToFetch.size === 0) return;

      try {
        const promises = Array.from(idsToFetch).map(id => getJobById(id));
        const results = await Promise.all(promises);
        results.forEach(job => {
          if (job) newDetailsMap.set(job._id, job);
        });

        setJobDetails(newDetailsMap);
        newDetailsMap.forEach((value, key) => {
          jobCache.set(key, value);
        });

      } catch (err) { console.error("Lỗi fetch job details:", err); }
    };

    fetchMemberDetails();
    fetchJobDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms, getUser, getJobById]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoadingMessages]);

  const handleSend = () => {
    if (!message.trim() || !currentRoomId || isLoadingMessages) return;
    sendMessage(currentRoomId, message, "text");
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const activeRoom = rooms.find(r => r._id === currentRoomId);

  return (
    <div className="chat-modal__overlay" onClick={onClose}>
      <div
        className="chat-widget__window"
        style={{ width: "700px", height: "500px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chat-widget__sidebar">
          <div className="chat-widget__sidebar-header">
            <h3>Tin nhắn</h3>
          </div>
          <div className="conversation-list">
            {rooms.map(r => {
              const otherMemberId = getOtherMemberId(r);
              const userDetail = memberDetails.get(otherMemberId);
              const jobDetail = jobDetails.get(r.jobId);

              return (
                <div
                  key={r._id}
                  className={`conversation-item ${r._id === currentRoomId ? 'selected' : ''}`}
                  onClick={() => handleSelectRoom(r._id)}
                >
                  <div className="conversation-item__avatar">
                    {userDetail?.avatar ? (
                      <img src={userDetail.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : (
                      <AiOutlineUser size={24} />
                    )}
                  </div>
                  <div className="conversation-item__details text-left">
                    <strong className="text-black">
                      {userDetail?.role === 'hr'
                        ? `HR ${userDetail.fullname}`
                        : (userDetail?.fullname || otherMemberId)}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: '#555' }}>
                      công việc: {jobDetail?.jobTitle || "..."}
                    </span>
                    <p>{r.lastMessage || "..."}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chat-widget__main">
          {!activeRoom ? (
            <div className="chat-widget__empty">
              <div className="chat-widget__empty_head">
                <button className="chat-widget__empty_head__closebtn hover:bg-gray-200">
                  <AiOutlineClose onClick={onClose}/>
                </button>
              </div>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            <>
              <div className="chat-widget__header">
                <span className="chat-widget__header-title text-left">
                  <div>
                    {
                      (() => {
                        const otherMemberId = getOtherMemberId(activeRoom);
                        const details = memberDetails.get(otherMemberId);

                        if (details?.role === 'hr') {
                          return `HR ${details.fullname}`;
                        }
                        return details?.fullname || otherMemberId;
                      })()
                    }
                    <small style={{ display: 'block', fontWeight: 'normal', opacity: 0.9 }}>
                      Về vị trí: {jobDetails.get(activeRoom.jobId)?.jobTitle || "..."}
                    </small>
                  </div>
                </span>
                <button className="chat-widget__close-button" onClick={onClose} aria-label="Đóng cửa sổ chat">
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <div className="chat-widget__body" ref={chatBodyRef}>
                {messages.map((msg: ChatMessage, index) => (
                  <div
                    key={index}
                    className={`message-message ${msg.senderId === currentUserId ? "message--user" : "message--hr"
                      }`}
                  >
                    {msg.message && <div>{msg.message}</div>}
                    <span className="message__timestamp">
                      {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}

                {isLoadingMessages && (
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
                  disabled={isLoadingMessages}
                />
                <button
                  className="chat-widget__send-button"
                  onClick={handleSend}
                  disabled={isLoadingMessages}
                >
                  <BsFillSendFill size={24} color="#10b981" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;