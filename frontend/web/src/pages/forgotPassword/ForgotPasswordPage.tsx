import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css'; // File CSS chung cho các trang này

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email của bạn.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password/forgot', { email });
      
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/otp-verification', { state: { email } });
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="title">Quên Mật Khẩu</h2>
        <p className="subtitle">Nhập email của bạn để nhận mã xác thực (OTP).</p>
        <form onSubmit={handleForgotPassword}>
          <div className="input-group">
            {/* <label htmlFor="email">Email</label> */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email của bạn"
              required
            />
          </div>
          <button type="submit" className="submit-button">Gửi Mã OTP</button>
        </form>
        <Link to="/login" className="back-link">
          Quay lại Đăng nhập
        </Link>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};