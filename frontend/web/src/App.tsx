import "./App.css";
import "./styles/colors.css";

import Home from "./pages/HomePage/Home";
import Login from "./pages/Started/Login";
import Register from "./pages/Started/Register";
import Intro from "./pages/Introduction/Intro";
import BuildCV from "./pages/buildCV/BuildCV";
import Profile from "./pages/Profile/Profile";
import JobDetails from "./pages/JobDetail/JobDetail";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/Protechted/ProtectedRoute";
import Cvs from "./pages/Cvs/Cvs";
import JobSave from "./pages/jobSave/jobSave";
import JobApplied from "./pages/JobApplied/JobApplied";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";

// Import các trang mới cho chức năng quên mật khẩu
import { ForgotPasswordPage } from "./pages/forgotPassword/ForgotPasswordPage";
import { OtpPage } from "./pages/forgotPassword/OtpPage";
import { ResetPasswordPage } from "./pages/forgotPassword/ResetPasswordPage";
import VerifyEmail from "./pages/forgotPassword/VerifyEmail";
import TermUser from "./pages/Terms/TermUser";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BuildCvs from "./pages/BuildCVs/BuildCvs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Thêm các Routes mới cho chức năng quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp-verification" element={<OtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/home" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/buildcv" element={<BuildCvs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobdetail" element={<JobDetails />} />
        <Route path="/jobdetail/:id" element={<JobDetails />} />
        <Route path="/cvs" element={<Cvs />} />
        <Route path="/liked" element={<JobSave />} />
        <Route path="/applyted" element={<JobApplied />} />
        <Route path="/termuser" element={<TermUser />} />


        <Route
          element={<ProtectedRoute allowedRoles={["hr"]} redirectTo="/home" />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
    
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />

        
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
