import React from "react";
import "./Footer.css";
import { FaUsers, FaHandsHelping, FaAvianex } from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white"
            style={{display: 'flex', justifyContent: 'center'}}
        >
            <div className="footer-fluid">
                {/* Footer top */}
                <div className="footer-top flex flex-col lg:flex-row gap-8 p-6 lg:p-12">

                    {/* Left side */}
                    <div className="flex flex-col items-start justify-start lg:w-3/5">
                        <span
                            className="text-left font-bold footer-slogan"
                        >
                            Kết nối tiềm năng, mở rộng cơ hội.
                        </span>

                        <button
                            style={{ zIndex: 1000 }}
                            onClick={() => alert("Button clicked!")}
                            className="footer-btn group animateRainbow rainbow-btn inline-flex items-center justify-center gap-2 relative px-6 py-2 h-12 rounded-2xl cursor-pointer bg-[length:200%] border-0 [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95 transition-transform duration-150 bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))]"
                        >
                            <div className="relative overflow-hidden h-6 z-10">
                                <div className="flex flex-col items-center transition-transform duration-300 ease-in-out group-hover:-translate-y-6">
                                    <div className="font-medium text-base text-white whitespace-nowrap h-6 flex items-center relative z-10">
                                        Bắt đầu ngay
                                    </div>
                                    <div className="font-medium text-base text-white whitespace-nowrap h-6 flex items-center relative z-10">
                                        Bắt đầu ngay
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Icons */}
                        <ul className="flex gap-6 mt-6" style={{ marginTop: 30 }}>
                            <li><FaUsers size={30} /></li>
                            <li><FaHandsHelping size={30} /></li>
                            <li><MdAttachMoney size={30} /></li>
                            <li><FaAvianex size={30} /></li>
                        </ul>
                    </div>

                    {/* Right side menu */}
                    <div className="lg:w-2/5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ul>
                                <p className="footer-title font-bold mb-2 ul-title">Về chúng tôi</p>
                                <li className="footer-li"><a href="/">Câu chuyện</a></li>
                                <li className="footer-li"><a href="/">Đội ngũ</a></li>
                                <li className="footer-li"><a href="/">Liên hệ</a></li>
                            </ul>

                            <ul>
                                <p className="footer-title  font-bold mb-2 ul-title">Dịch vụ</p>
                                <li className="footer-li"><a href="/">Tìm việc</a></li>
                                <li className="footer-li"><a href="/">Quản lí cv</a></li>
                                <li className="footer-li"><a href="/">Tạo cv</a></li>
                            </ul>

                            <ul>
                                <p className="footer-title  font-bold mb-2 ul-title">Tài nguyên</p>
                                <li className="footer-li"><a href="/">Blog</a></li>
                                <li className="footer-li"><a href="/">FAQ</a></li>
                                <li className="footer-li"><a href="/">Hỗ trợ</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer bottom */}
                <div className="footer-bottom flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-700 text-gray-400 text-sm"
                    style={{ padding: 30, marginTop: 20 }}
                >
                    <div>© 2025 SmartHire. All rights reserved.</div>
                    <div>Điều khoản sử dụng | Chính sách bảo mật</div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
