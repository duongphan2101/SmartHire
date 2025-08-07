import { useState } from "react";
import "../../components/Started/Login.css";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShown, setIsShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Regex check
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;

    if (!email) {
      toast.error("Email không được để trống");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Email phải đúng cú pháp");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Mật khẩu phải có ít nhất 1 ký tự hoa, 1 số và 1 ký tự đặc biệt"
      );
      return;
    }
    toast.success("Đăng nhập thành công!");
    navigate("/home");
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="tab-switch">
          <Link
            to="/login"
            className={`tab1 ${location.pathname === "/login" ? "active-tab" : ""
              }`}
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className={`tab2 ${location.pathname === "/register" ? "active-tab" : ""
              }`}
          >
            Đăng ký
          </Link>
        </div>

        <h2 className="title">Đăng nhập</h2>

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

          <div className="input-group">
            <input
              type={isShown ? "text" : "password"}
              id="pass"
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

          <button className="signup-btn" type="submit" >
            Đăng nhập
          </button>
        </form>

        <div className="divider">
          <hr />
          <span>hoặc</span>
          <hr />
        </div>

        <div className="social-buttons">
          <button className="social-btn facebook">
            <FaFacebook size={20} color="#197ce6" />
            Đăng nhập với Facebook
          </button>

          <button className="social-btn google">
            <FcGoogle size={20} />
            Đăng nhập với Google
          </button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
