import React, { useEffect, useState } from "react";
import "./NotificationModal.css";
import { type Notification } from "../../hook/useNotification";
import { useChat } from "../../hook/useChat";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { ChatRequest } from "../../utils/interfaces";

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
  const MySwal = withReactContent(Swal);
  const [requestData, setRequestData] = useState<ChatRequest>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getChatRequestbyId(notification.requestId);
      setRequestData(data);
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

    return (
      <div className="notification-overlay" onClick={onClose}>
        <div className="notification-box" onClick={(e) => e.stopPropagation()}>
          <h3 className="notification-title">{notification.title}</h3>
          <p className="notification-message text-black">{notification.message}</p>
          <small className="notification-time text-right">
            {new Date(notification.createdAt).toLocaleString("vi-VN")}
          </small>

          {notification.type === "CHAT_REQUEST" && requestData?.status == "pending" && (
            <div className="flex items-center justify-center gap-8" style={{ marginTop: 10 }}>
              <button onClick={handleAccept} className="notify-modal-btn notify-modal-btn_accept">Chấp nhận</button>
              <button onClick={handleReject} className="notify-modal-btn notify-modal-btn_inject">Từ chối</button>
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
