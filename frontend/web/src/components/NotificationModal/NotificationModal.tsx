import React, { useEffect, useState } from "react";
import "./NotificationModal.css";
import { type Notification } from "../../hook/useNotification";
import { useChat } from "../../hook/useChat";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { ChatRequest, Interview } from "../../utils/interfaces";
import useInterview from "../../hook/useInterview";
import dayjs from "dayjs";

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
}) => {
  if (!notification) return null;

  const { acceptChatRequest, rejectChatRequest, getChatRequestbyId } = useChat();
  const { fetchInterviewById } = useInterview();
  const MySwal = withReactContent(Swal);
  const [requestData, setRequestData] = useState<ChatRequest>();
  const [interviewInviteData, setInterviewInviteData] = useState<Interview>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getChatRequestbyId(notification.requestId);
      setRequestData(data);
      const interviewData = await fetchInterviewById(notification.requestId);
      setInterviewInviteData(interviewData);
    };
    fetchData();
  }, [notification.requestId]);

  const handleAccept = async () => {
    try {
      await acceptChatRequest(notification.requestId);
      MySwal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã chấp nhận lời mời, giờ bạn và nhà tuyển dụng có thể trò chuyện với nhau!",
      });
      onClose();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi chấp nhận lời mời!",
      });
    }
  };

  const handleReject = async () => {
    try {
      await rejectChatRequest(notification.requestId);
      MySwal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã từ chối lời mời!",
      });
      onClose();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi từ chối lời mời!",
      });
    }
  };

  const handleAcceptInterviewInvite = async () => {
    MySwal.fire({
      icon: "success",
      title: "Thành công",
      text: "Đã chấp nhận lời mời, giờ bạn và nhà tuyển dụng có thể trò chuyện với nhau!",
    });
  };

  const handleRejectInterviewInvite = async () => {
    MySwal.fire({
      icon: "success",
      title: "Thành công",
      text: "Đã từ chối lời mời!",
    });
  };

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="notification-title">{notification.title}</h3>
        <p className="notification-message text-black">{notification.message}</p>
        <p className="notification-message text-black">
          <strong>{interviewInviteData?.mode === "offline" ? "OFFLINE" : "ONLINE"}</strong> tại <strong>{interviewInviteData?.location}</strong>
        </p>
        <p className="notification-message text-black">
          vào lúc <strong>{interviewInviteData?.scheduledAt
            ? dayjs(interviewInviteData.scheduledAt).format('DD/MM/YYYY HH:mm')
            : ''}
          </strong>
        </p>
        <small className="notification-time text-right">
          {new Date(notification.createdAt).toLocaleString("vi-VN")}
        </small>

        {notification.type === "CHAT_REQUEST" && requestData?.status == "pending" && (
          <div className="flex items-center justify-center gap-8" style={{ marginTop: 10 }}>
            <button onClick={handleAccept} className="notify-modal-btn notify-modal-btn_accept">Chấp nhận</button>
            <button onClick={handleReject} className="notify-modal-btn notify-modal-btn_inject">Từ chối</button>
          </div>
        )}

        {notification.type === "INTERVIEW_INVITE" && interviewInviteData?.status == "pending" && (
          <div className="flex items-center justify-center gap-8" style={{ marginTop: 10 }}>
            <button onClick={handleAcceptInterviewInvite} className="notify-modal-btn notify-modal-btn_accept">Chấp nhận</button>
            <button onClick={handleRejectInterviewInvite} className="notify-modal-btn notify-modal-btn_inject">Từ chối</button>
          </div>
        )}

        <div className="notification-footer">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
