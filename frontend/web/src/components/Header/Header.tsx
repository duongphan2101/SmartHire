import React, { useState, useEffect } from "react";
import axios from "axios";
import useNotification from "../../hook/useNotification";
import { type Notification } from "../../hook/useNotification";
import "./Header.css";
import useUser from "../../hook/useUser";
import { FaRegBell } from "react-icons/fa";
import {
  AiOutlineMessage,
  AiOutlineProfile,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import { FaRegBookmark } from "react-icons/fa6";
import { PiReadCvLogo } from "react-icons/pi";
import { FaRegCheckSquare } from "react-icons/fa";
import NotificationModal from "../NotificationModal/NotificationModal";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getUser, loadingUser, user } = useUser();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const { notifications, setNotifications } = useNotification(user?._id);
  const [openNotify, setOpenNotify] = useState(false);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleNotificationClick = async (n: Notification) => {
    // 👈 Khai báo type cho n
    try {
      if (!n.isRead) {
        await axios.patch(
          `http://localhost:7000/api/notifications/${n._id}/read`
        );

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === n._id ? { ...item, isRead: true } : item
          )
        );
      }

      setSelectedNotification(n);
      setOpenModal(true);
    } catch (err) {
      console.error("Lỗi khi mark as read:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:7000/api/notifications/${user._id}`)
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
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

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/home";
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    alert("Chức năng đang được phát triển!");
  };

  return (
    <header className="header-container">
      <div className="header-script">
        S m a r t H i r e - Nền tảng tuyển dụng thông minh
      </div>

      <header className="header">
        <div className="header-logo header-item">
          <a href="/">
            <span className="span-logo">
              <span style={{ color: "#059669" }}>Smart</span>Hire
            </span>
          </a>
        </div>

        <div className="header-nav header-item desktop-only">
          <nav>
            <a
              className="nav-item"
              href="/"
              style={{ color: "#fff", margin: "0 1rem" }}
            >
              Trang chủ
            </a>
            <a
              className="nav-item"
              href="/intro"
              style={{ color: "#fff", margin: "0 1rem" }}
            >
              Về chúng tôi
            </a>
            <a
              className="nav-item"
              href="/buildCV"
              style={{ color: "#fff", margin: "0 1rem" }}
            >
              Tạo CV
            </a>
          </nav>
        </div>

        <div className="header-user header-item desktop-only">
          {loadingUser ? (
            <span style={{ color: "#fff" }}>Đang tải...</span>
          ) : user ? (
            <div style={{ color: "#fff" }} className="header-user_info">
              <div
                className="user-notify user-info-item"
                style={{ position: "relative" }}
              >
                <FaRegBell
                  size={20}
                  onClick={() => setOpenNotify(!openNotify)}
                />
                {unreadCount > 0 && (
                  <span className="badge">{unreadCount}</span>
                )}

                {openNotify && (
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <p>Không có thông báo</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`notification-item-hr ${n.isRead ? "read" : "unread"
                            }`}
                        >
                          <strong>{n.title}</strong>
                          <p className="notification-preview-hr text-white"
                            style={{ color: 'white' }}
                          >
                            {n.message.length > 70
                              ? n.message.slice(0, 70) + "..."
                              : n.message}
                          </p>
                          <small>
                            {new Date(n.createdAt).toLocaleString()}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {openModal && (
                  <NotificationModal
                    notification={selectedNotification}
                    onClose={() => setOpenModal(false)}
                  />
                )}
              </div>
              <div className="user-mess user-info-item">
                <AiOutlineMessage size={20} />
              </div>
              <div className="user-sep user-info-item">
                <img className="user-avt" src={user.avatar} />

                <div className="tab-user_info">
                  <a href="/profile" className="tab-user_info-header">
                    <img
                      className="user-avt"
                      style={{ width: 60, height: 60 }}
                      src={user.avatar}
                    />
                    <span
                      className="fullname"
                      style={{ fontSize: 18, fontWeight: "bold" }}
                    >
                      {user.fullname}
                    </span>
                  </a>

                  <div className="user-dropdown">
                    <a className="user-dropdown-item" href="/profile">
                      Hồ sơ
                    </a>
                    <a className="user-dropdown-item" href="/cvs">
                      Tủ CV
                    </a>
                    <a className="user-dropdown-item" href="/liked">
                      Công việc đã lưu
                    </a>
                    <a className="user-dropdown-item" href="/applyted">
                      Công việc đã ứng tuyển
                    </a>
                    <a className="user-dropdown-item" href="/termUser">
                      Điều khoản người dùng
                    </a>
                    <a className="user-dropdown-item" href="/setting">
                      Cài đặt
                    </a>
                    <a className="user-dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <a
                className="header-user_btn"
                href="/register"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#fff",
                  color: "#fff",
                }}
              >
                Đăng ký
              </a>
              <a className="header-user_btn" href="/login">
                Đăng nhập
              </a>
            </div>
          )}
        </div>

        <div className="mobile-only">
          <button
            className="hamburger-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            &#9776;
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu flex flex-col justify-between">
          {user ? (
            <div className="mobile-user-info">
              <div className="mobile-user-profile">
                <div className="mobile-user-dropdown">
                  <div className="mobile-user-user flex items-center gap-3">
                    <img className="mobile-user-avatar" src={user.avatar} />
                    <div className="flex flex-col text-left">
                      <span
                        className="mobile-user-name"
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        {user.fullname}
                      </span>
                      <span
                        className="mobile-user-email"
                        style={{ fontSize: 12, color: "#ddd" }}
                      >
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div
                    className="mobile-user-item"
                    style={{ paddingTop: 10 }}
                    onClick={handleClick}
                  >
                    <FaRegBell size={20} color="#ddd" />
                    <span style={{ color: "#ddd" }}>Thông báo</span>
                  </div>

                  <div
                    className="mobile-user-item"
                    style={{ paddingTop: 10 }}
                    onClick={handleClick}
                  >
                    <AiOutlineMessage size={20} color="#ddd" />
                    <span style={{ color: "#ddd" }}>Tin nhắn</span>
                  </div>

                  <a className="mobile-user-item" href="/profile">
                    <AiOutlineProfile /> Hồ sơ
                  </a>
                  <a className="mobile-user-item" href="/cvs">
                    <PiReadCvLogo />
                    Tủ CV
                  </a>
                  <a className="mobile-user-item" href="/liked">
                    <FaRegBookmark />
                    Công việc đã lưu
                  </a>
                  <a className="mobile-user-item" href="/applyted">
                    <FaRegCheckSquare />
                    Công việc đã ứng tuyển
                  </a>
                  <a className="mobile-user-item" href="/setting">
                    <AiOutlineSetting />
                    Cài đặt
                  </a>
                  <a className="mobile-user-item active" onClick={handleLogout}>
                    <AiOutlineLogout />
                    Đăng xuất
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <a
                className="mobile-btn-register"
                href="/register"
                onClick={() => setMenuOpen(false)}
              >
                Đăng ký
              </a>
              <a
                className="mobile-btn-login"
                href="/login"
                onClick={() => setMenuOpen(false)}
              >
                Đăng nhập
              </a>
            </div>
          )}

          <nav className="mobile-nav">
            <a href="/" onClick={() => setMenuOpen(false)}>
              Trang chủ
            </a>
            <a href="/about" onClick={() => setMenuOpen(false)}>
              Về chúng tôi
            </a>
            <a href="/buildCV" onClick={() => setMenuOpen(false)}>
              Tạo CV
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
