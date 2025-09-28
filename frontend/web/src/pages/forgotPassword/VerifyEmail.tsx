import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VerifyEmail.css";
import { HOSTS } from "../../utils/host";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Đang xác nhận email...");

 useEffect(() => {
    if (token) {
      const verifyUrl = `${HOSTS.emailService}/api/email/verify?token=${token}`;
      console.log("Gửi yêu cầu xác thực đến:", verifyUrl); // Debug URL
      axios
        .get(verifyUrl)
        .then((response) => {
          console.log("Response từ email service:", response.data);
          setStatus("✅ Xác nhận thành công! Chuyển đến đăng nhập...");
          toast.success("Xác nhận email thành công!");
          setTimeout(() => navigate("/login"), 2000);
        })
        .catch((error) => {
          console.error("Lỗi xác thực email:", error.response?.data || error.message);
          setStatus("❌ Xác nhận thất bại hoặc token đã hết hạn.");
          toast.error("Xác nhận thất bại hoặc token đã hết hạn.");
        });
    } else {
      setStatus("Không tìm thấy token xác thực.");
    }
  }, [token, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="title">Xác thực Email</h2>
        <p className="subtitle">{status}</p>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
