import { useState } from "react";
import "./Register.css";
// import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hook/useAuth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import TermsModal from "../../components/TermsModal/TermsModal";

function Login() {
  const location = useLocation();
  const { register, logout } = useAuth();

  const [isShown, setIsShown] = useState(false);
  const [isShownRe, setIsShownRe] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [role, setRole] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const MySwal = withReactContent(Swal);

  const handleOpen = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validate trước khi mở modal
    if (!email || !fullName || !password || !repassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (password !== repassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }
    setAcceptedTerms(true);
  };

  const handleSubmit = async () => {
    // e.preventDefault();

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

    try {
      console.log("Alert role: ", role);
      await register(fullName, email, password, role);

      const result = await MySwal.fire({
        title: "Đăng ký thành công!",
        text: "Vui lòng kiểm tra Email để xác nhận tài khoản",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Không",
      });

      if (result.isConfirmed) {
        window.location.href = "/home";
      } else {
        logout();
        setEmail("");
        setFullName("");
        setPassword("");
        setRePassword("");
        return;
      }
    } catch (err: any) {
      toast.error("Đăng ký thất bại, vui lòng thử lại");
      console.log(err?.message);
      return;
    }
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

        <h2 className="title">Đăng ký</h2>

        {/* Modal */}
        {acceptedTerms && (
          <TermsModal
            onClose={() => setAcceptedTerms(false)}
            onConfirm={(selectedRole) => {
              setRole(selectedRole);
              setAcceptedTerms(false);
              handleSubmit();
            }}
          />
        )}


        {/* <div className="social-buttons">
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
        </div> */}

        <form className="signup-form" onSubmit={handleOpen}>
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
              type="text"
              id="hoten"
              placeholder="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="password-row">
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
                {isShown ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <div className="input-group">
              <input
                type={isShownRe ? "text" : "password"}
                id="repassword"
                placeholder="Xác nhận mật khẩu"
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="input-field"
              />
              <span
                className="toggle-password"
                onClick={() => setIsShownRe(!isShownRe)}
              >
                {isShownRe ? <FaEye /> : <FaEyeSlash />}
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
