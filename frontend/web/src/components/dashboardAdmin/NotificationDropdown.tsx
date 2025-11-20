import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../dashboardAdmin/NotificationDropdown.css"; 

dayjs.extend(relativeTime);

export interface NotificationItem {
  _id: string;
  receiverId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  requestId: string;
  createdAt: string;
}

interface Props {
  notifications: NotificationItem[];
  loading: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAll: () => void;
  onItemClick: (item: NotificationItem) => void;
}

const NotificationDropdown: React.FC<Props> = ({
  notifications,
  loading,
  onMarkRead,
  onMarkAll,
  onItemClick,
}) => {
  return (
    
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <strong>Thông báo</strong>
        <button onClick={onMarkAll}>Đánh dấu tất cả</button>
      </div>

      <div>
        {loading && <div className="notification-loading">Đang tải...</div>}
        {!loading && notifications.length === 0 && (
          <div className="notification-empty">Không có thông báo</div>
        )}
        {!loading &&
          notifications.map((n) => (
            <div
              key={n._id}
              className={`notification-item ${!n.isRead ? "unread" : ""}`}
              onClick={() => onItemClick(n)}
            >
              <div className="notification-item-title">
                <span>{n.title}</span>
                <span className="notification-item-time">
                  {dayjs(n.createdAt).fromNow()}
                </span>
              </div>
              <div className="notification-item-message">{n.message.length > 70
                        ? n.message.slice(0, 60) + "..."
                        : n.message}</div>
              
              {!n.isRead && (
                <button
                  className="mark-read-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead(n._id);
                  }}
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;
