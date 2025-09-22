import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { resetToken } = location.state || {};

  // Kiểm tra nếu không có token thì không cho phép truy cập
  if (!resetToken) {
    navigate('/forgot-password', { replace: true });
    return null;
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    
    // Gửi yêu cầu đặt lại mật khẩu
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password/reset', {
        resetToken,
        newPassword,
        confirmPassword,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Chuyển hướng về trang đăng nhập
        navigate('/login');
      } else {
        toast.error(response.data.message || "Đặt lại mật khẩu thất bại.");
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
        <h2 className="title">Đặt Lại Mật Khẩu</h2>
        <p className="subtitle">Nhập mật khẩu mới của bạn.</p>
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label htmlFor="new-password">Mật khẩu mới</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>
          <button type="submit" className="submit-button">Đặt Lại Mật Khẩu</button>
        </form>
        <Link to="/login" className="back-link">
          Quay lại Đăng nhập
        </Link>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};