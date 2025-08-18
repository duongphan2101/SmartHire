import React, { useState } from "react";

import './Header.css';

const Header: React.FC = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
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
      )}

    </header>
  );
};

export default Header;