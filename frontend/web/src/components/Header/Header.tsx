import React from "react";

import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header-container">

            <div className="header-script">
                SmartHire - Your AI-Powered Recruitment Assistant
            </div>

            <header className="header">

                <div className="header-logo header-item">
                    <span style={{ fontSize: 24, fontWeight: 'bold' }}>SmartHire</span>
                </div>

                <div className="header-nav header-item">
                    <nav >
                        <a href="/" style={{ color: '#fff', margin: '0 1rem' }}>Home</a>
                        <a href="/about" style={{ color: '#fff', margin: '0 1rem' }}>About</a>
                        <a href="/contact" style={{ color: '#fff', margin: '0 1rem' }}>Contact</a>
                    </nav>
                </div>

                <div className="header-user header-item">
                    <div>
                        <button className="header-user_btn"
                            style={{ backgroundColor: 'transparent', borderColor: '#fff', color: '#fff' }}
                        >
                            Đăng ký
                        </button>

                        <button className="header-user_btn">
                            Đăng nhập
                        </button>
                    </div>
                </div>

            </header>

        </header>
    );
};

export default Header;