import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VerifyEmail.css";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Đang xác nhận email...");

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:5000/api/email/verify?token=${token}`)
        .then(() => {
          setStatus("✅ Xác nhận thành công! Chuyển đến đăng nhập...");
          toast.success("Xác nhận email thành công!");
          setTimeout(() => navigate("/login"), 2000);
        })
        .catch(() => {
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
