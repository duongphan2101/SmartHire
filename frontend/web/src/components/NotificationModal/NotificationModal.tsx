import React from "react";
import "./NotificationModal.css";
import { type Notification } from "../../hook/useNotification";

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
}) => {
  if (!notification) return null;

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="notification-title">{notification.title}</h3>
        <p className="notification-message text-black">{notification.message}</p>
        <small className="notification-time text-right">
          {new Date(notification.createdAt).toLocaleString("vi-VN")}
        </small>
        <div className="notification-footer">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
