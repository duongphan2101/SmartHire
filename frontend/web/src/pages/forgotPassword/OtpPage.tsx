import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';

export const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 phút = 600 giây
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      // Nếu không có email, chuyển hướng về trang quên mật khẩu
      navigate('/forgot-password', { replace: true });
      return;
    }
    
    // Bắt đầu đếm ngược
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Mã OTP phải có 6 chữ số.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password/verify', { email, otp });
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Chuyển hướng đến trang đặt lại mật khẩu với resetToken
        navigate('/reset-password', { state: { resetToken: response.data.resetToken } });
      } else {
        toast.error(response.data.message || "Mã OTP không hợp lệ.");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password/resend', { email });
      if (response.data.success) {
        toast.success(response.data.message);
        setCountdown(600); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Không thể gửi lại OTP. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null; // Hoặc một trang loading
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="title">Xác Thực OTP</h2>
        <p className="subtitle">
          Một mã OTP đã được gửi đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn.
        </p>
        <form onSubmit={handleVerifyOtp}>
          <div className="input-group">
            {/* <label htmlFor="otp">Mã OTP</label> */}
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Nhập 6 chữ số OTP"
              required
            />
          </div>
          <p className="countdown">
            Mã OTP sẽ hết hạn sau: <span>{formatTime(Math.max(0, countdown))}</span>
          </p>
          <button type="submit" className="submit-button">Xác Thực</button>
        </form>
        {countdown <= 0 && (
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="resend-button"
          >
            {isResending ? 'Đang gửi lại...' : 'Gửi Lại Mã'}
          </button>
        )}
        <Link to="/login" className="back-link">
          Quay lại Đăng nhập
        </Link>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};