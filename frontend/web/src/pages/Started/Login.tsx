import { useState, useEffect } from "react";
import "./Login.css";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hook/useAuth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShown, setIsShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, loginWithFacebook, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email không được để trống");
      return;
    }

    if (!password) {
      toast.error("Mật khẩu không được để trống");
      return;
    }

    try {
      const result = await login(email, password);
      if (result) {
        if (result.user.role === "hr") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Đăng nhập thất bại!");
    }

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

          <button className="signup-btn" type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="divider">
          <hr />
          <span>hoặc</span>
          <hr />
        </div>

        <div className="social-buttons">
          <button className="social-btn facebook"
            onClick={loginWithFacebook}
          >
            <FaFacebook size={20} color="#197ce6" />
            Đăng nhập với Facebook
          </button>

          <button className="social-btn google"
            onClick={loginWithGoogle}
          >
            <FcGoogle size={20} />
            Đăng nhập với Google
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
}

export default Login;
