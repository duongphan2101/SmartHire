import React, { useState, useEffect } from "react";
import './Header.css';
import useUser from "../../hook/useUser";
import { FaRegBell } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getUser, loadingUser, user } = useUser();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.user_id) {
          getUser(parsed.user_id);
        }
      }
    } catch (e) {
      console.error("Invalid user data in localStorage", e);
    }
  }, [getUser]);

  return (
    <header className="header-container">
      <div className="header-script">
        S m a r t H i r e - Nền tảng tuyển dụng thông minh
      </div>

      <header className="header">
        <div className="header-logo header-item">
          <a href="/">
            <span className="span-logo">
              <span style={{ color: '#059669' }}>Smart</span>Hire
            </span>
          </a>
        </div>

        <div className="header-nav header-item desktop-only">
          <nav>
            <a className="nav-item" href="/" style={{ color: '#fff', margin: '0 1rem' }}>Trang chủ</a>
            <a className="nav-item" href="/intro" style={{ color: '#fff', margin: '0 1rem' }}>Về chúng tôi</a>
            <a className="nav-item" href="/create-cv" style={{ color: '#fff', margin: '0 1rem' }}>Tạo CV</a>
          </nav>
        </div>

        <div className="header-user header-item desktop-only">
          {loadingUser ? (
            <span style={{ color: "#fff" }}>Đang tải...</span>
          ) : user ? (
            <div style={{ color: "#fff" }} className="header-user_info">

              <div className="user-notify user-info-item">
                <FaRegBell size={20} />
              </div>
              <div className="user-mess user-info-item">
                <AiOutlineMessage size={20} />
              </div>
              <div className="user-sep user-info-item">
                <img className="user-avt" src={user.avatar} />

                <div className="tab-user_info">
                  <a href="/profile" className="tab-user_info-header">
                    <img className="user-avt" style={{ width: 60, height: 60 }} src={user.avatar} />
                    <span style={{ fontSize: 18, fontWeight: "bold" }}>{user.fullname}</span>
                  </a>

                  <div className="user-dropdown">
                    <a className="user-dropdown-item" href="/profile">Hồ sơ của tôi</a>
                    <a className="user-dropdown-item" href="/settings">Cài đặt</a>
                    <a className="user-dropdown-item" href="/logout">Đăng xuất</a>
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div>
              <a className="header-user_btn" href="/register"
                style={{ backgroundColor: 'transparent', borderColor: '#fff', color: '#fff' }}
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

      {
        menuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <a href="/" onClick={() => setMenuOpen(false)}>Trang chủ</a>
              <a href="/about" onClick={() => setMenuOpen(false)}>Về chúng tôi</a>
              <a href="/contact" onClick={() => setMenuOpen(false)}>Tạo CV</a>
            </nav>
            <div className="mobile-user-buttons">
              <a
                className="header-user_btn"
                href="/register"
                style={{ backgroundColor: 'transparent', borderColor: '#fff', color: '#fff', display: 'inline-block' }}
                onClick={() => setMenuOpen(false)}
              >
                Đăng ký
              </a>
              <a
                className="header-user_btn"
                href="/login"
                onClick={() => setMenuOpen(false)}
              >
                Đăng nhập
              </a>
            </div>
          </div>
        )
      }
    </header >
  );
};

export default Header;
