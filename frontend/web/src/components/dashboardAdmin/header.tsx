import React, { useEffect, useState, useRef } from "react";
import "./header.css";
import logo from "../../assets/images/logo_v1.png";
import useUser from "../../hook/useUser";
import useNotification, { type Notification } from "../../hook/useNotification";
import NotificationDropdown from "./NotificationDropdown";
import axios from "axios";
import { HOSTS } from "../../utils/host";
import { io } from "socket.io-client";
import ReportDetailModal, {type ReportDetail } from "./ReportDetailModal";


interface AdminHeaderProps {
  breadcrumb: string;
  setPage: (
    page:
      | "dashboard"
      | "manageUsers"
      | "manageHR"
      | "company"
      | "userTerms"
      | "hrTerms"
      | "about"
  ) => void;
  adminName: string;
}

const NOTIF_API_HOST = HOSTS.notificationService;

const AdminHeader: React.FC<AdminHeaderProps> = ({
  breadcrumb,
  setPage,
  adminName,
}) => {
  const { getUser, user } = useUser();
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // adminId
  const getAdminId = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.user_id ?? parsed._id ?? "admin";
      }
    } catch {}
    return "admin";
  };

  const adminId = getAdminId();

  const { notifications, setNotifications, fetchNotifications, loading } =
    useNotification(adminId);

  useEffect(() => {
    const socket = io(HOSTS.socket, { transports: ["websocket", "polling"] });

    socket.emit("join", adminId);

    socket.on("new-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [adminId]);

  const [showNotiModal, setShowNotiModal] = useState(false);

  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleReportClick = (report: ReportDetail) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  useEffect(() => {
    try {
      const storedAvatar = localStorage.getItem("adminAvatar");
      if (storedAvatar) setAdminAvatar(storedAvatar);
    } catch {}
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const idToFetch = parsed.user_id ?? parsed._id;
        getUser(idToFetch);
      }
    } catch {}
  }, [getUser]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleNotiModal = async () => {
    const next = !showNotiModal;
    setShowNotiModal(next);
    if (next && adminId) {
      await fetchNotifications(adminId);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await axios.patch(`${NOTIF_API_HOST}/${id}/read`);
      setNotifications((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isRead: true } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      const unread = notifications.filter((n) => !n.isRead);
      await Promise.all(
        unread.map((n) => axios.patch(`${NOTIF_API_HOST}/${n._id}/read`))
      );
      setNotifications((prev) => prev.map((p) => ({ ...p, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (n: Notification) => {
    if (!n.isRead) await handleMarkRead(n._id);
    if (n.requestId) console.log("Open related request:", n.requestId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newAvatar = reader.result as string;
      setAdminAvatar(newAvatar);
      localStorage.setItem("adminAvatar", newAvatar);
    };
    reader.readAsDataURL(file);
  };

  const handleAbout = () => setPage("about");

  return (
    <div className="admin-main-header">
      <div className="admin-header-left">
        <div className="admin-logo-container">
          <img src={logo} alt="Logo" className="admin-logo-image" />
        </div>
        <span className="admin-app-name">SmartHire</span>
        <div className="admin-breadcrumbs">
          {breadcrumb.split(" > ").map((item, index, arr) => (
            <React.Fragment key={item}>
              <span
                className={`admin-breadcrumb-item ${
                  index === arr.length - 1 ? "current" : ""
                }`}
              >
                {item}
              </span>
              {index < arr.length - 1 && (
                <span className="admin-breadcrumb-divider">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="admin-header-right">
        <span style={{ fontSize: 18 }}>{adminName}</span>

        <div className="admin-icon-group" style={{ position: "relative" }}>
          <button className="admin-icon-button" onClick={toggleNotiModal}>
            {/* bell svg */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                fill="currentColor"
                d="M20 17h2v2H2v-2h2v-7a8 8 0 1116 0v7zm-2 0v-7a6 6 0 10-12 0v7h12zm-9 4h6v2H9v-2z"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="noti-badge">{unreadCount}</span>
            )}
          </button>

          {showNotiModal && (
            <NotificationDropdown
              notifications={notifications}
              loading={loading}
              onClose={() => setShowNotiModal(false)}
              onMarkRead={handleMarkRead}
              onMarkAll={handleMarkAll}
              onItemClick={(n) => {
                if (!n.isRead) handleMarkRead(n._id);
                if (n.type === "REPORT") {
                  handleReportClick({
                    title: n.title,
                    details: n.message,
                    jobId: n.requestId,
                  });
                }
              }}
            />
          )}
        </div>

        <div className="admin-user-avatar" onClick={handleAbout}>
          <img
            src={adminAvatar || user?.avatar}
            alt="Admin Avatar"
            className="admin-avatar-image"
          />
          <button className="admin-avatar-dropdown-button">
            <svg
              className="admin-dropdown-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <ReportDetailModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        report={selectedReport}
      />
    </div>
  );
};

export default AdminHeader;
