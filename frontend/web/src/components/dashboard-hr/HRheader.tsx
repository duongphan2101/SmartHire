import React, { useEffect, useState } from "react";
import axios from "axios";
import useNotification from "../../hook/useNotification"; 
import "./HRheader.css";
import logo from "../../assets/images/logo_v1.png";
import useUser from "../../hook/useUser";
import usePayment from "../../hook/usePayment";
import { IoWalletOutline } from 'react-icons/io5';

interface HRheaderProps {
  breadcrumb: string;
  setPage: (
    page: "dashboard" | "about" | "company" | "jobPost" | "payment"
  ) => void;
  companyName: string;
}

const HRheader = ({ breadcrumb, setPage, companyName }: HRheaderProps) => {
  const { getUser, user } = useUser();
  const [companyAvatar, setCompanyAvatar] = useState<string | null>(null);
  const { balance } = usePayment();
  const { notifications, setNotifications } = useNotification(user?._id);
  const [openNotify, setOpenNotify] = useState(false);

   useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:7000/api/notifications/${user._id}`)
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, setNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Load avatar từ localStorage khi component mount
  useEffect(() => {
    try {
      const storedAvatar = localStorage.getItem("companyAvatar");
      if (storedAvatar) {
        setCompanyAvatar(storedAvatar);
      }
    } catch (e) {
      console.error("Error loading avatar from localStorage", e);
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const idToFetch = parsed.user_id ?? parsed._id;
        getUser(idToFetch);
      }
    } catch (e) {
      console.error("Invalid user data in localStorage", e);
    }
  }, [getUser]);

  const handleAbout = () => {
    setPage("about");
  };

  const handlePayment = () => {
    setPage("payment");
  };

  return (
    <div className="main-header">
      <div className="header-left">
        <div className="logo-container">
          <img src={logo} alt="OripioFin Logo" className="logo-image" />
        </div>
        <span className="app-name">SmartHire</span>
        <div className="breadcrumbs">
          {breadcrumb.split(" > ").map((item, index: number, array) => (
            <React.Fragment key={item}>
              <span
                className={`breadcrumb-item ${
                  index === array.length - 1 ? "current" : ""
                }`}
              >
                {item}
              </span>
              {index < array.length - 1 && (
                <span className="breadcrumb-divider">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="header-right">
        <span style={{ fontSize: "18px" }}>{companyName}</span>
        <div className="icon-group">
          <button
            className="icon-button"
            onClick={() => setOpenNotify(!openNotify)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                fill="currentColor"
                d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zm-2 0v-7a6 6 0 1 0-12 0v7h12zm-9 4h6v2H9v-2z"
              ></path>
            </svg>
             {unreadCount > 0 && <span className="badge-hr">{unreadCount}</span>}
          </button>
          {openNotify && (
            <div className="notification-list-hr">
              {notifications.length === 0 ? (
                <p>Không có thông báo</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notification-item-hr ${n.isRead ? "read" : "unread"}`}
                  >
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    <small>{new Date(n.createdAt).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <IoWalletOutline size={24} className="cursor-pointer" onClick={handlePayment} />
            <span className="cursor-pointer" onClick={handlePayment}>Số dư: {balance} Coin</span>
          </div>
        </div>

        <div className="user-avatar" onClick={handleAbout}>
          <img src={user?.avatar} alt="User Avatar" className="avatar-image" />
          <button className="avatar-dropdown-button">
            <svg
              className="dropdown-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRheader;
