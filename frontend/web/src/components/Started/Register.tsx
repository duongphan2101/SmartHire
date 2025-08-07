import { useState } from "react";
import "../../components/Started/Register.css";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const location = useLocation();
  const [isShown, setIsShown] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Regex check
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;

    // Validate
    if (!email) {
      toast.error("Email không được để trống");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Email phải đúng cú pháp");
      return;
    }

    if (!fullName.trim()) {
      toast.error("Họ và tên không được để trống");
      return;
    }

    if (/^\d+$/.test(fullName.trim())) {
      toast.error("Họ và tên không được là số");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Mật khẩu phải có ít nhất 1 ký tự hoa, 1 số và 1 ký tự đặc biệt"
      );
      return;
    }
    toast.success("Đăng ký thành công!");
  };
  return (
    <div className="login-background">
      <div className="login-container">
        <div className="tab-switch">
          <Link
            to="/login"
            className={`tab1 ${location.pathname === "/login" ? "active-tab" : ""}`}
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className={`tab2 ${location.pathname === "/register" ? "active-tab" : ""}`}
          >
            Đăng ký
          </Link>
        </div>

        <h2 className="title">Đăng ký</h2>

        <div className="social-buttons">
          <button className="social-btn facebook">
            <FaFacebook size={20} color="#197ce6" />
            Đăng ký với Facebook
          </button>

          <button className="social-btn google">
            <FcGoogle size={20} />
            Đăng ký với Google
          </button>
        </div>
        <div className="divider">
          <hr />
          <span>hoặc</span>
          <hr />
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="password-row">
            <div className="input-group">
              <input
                type="text"
                id="hoten"
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <input
                type={isShown ? "text" : "password"}
                id="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
              <span
                className="toggle-password"
                onClick={() => setIsShown(!isShown)}
              >
                {isShown ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button className="signup-btn" type="submit">
            Đăng ký
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
