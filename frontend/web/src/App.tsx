import "./App.css";
import "./styles/colors.css";

import Home from "./pages/HomePage/Home";
import Login from "./pages/Started/Login";
import Register from "./pages/Started/Register";
import Intro from "./pages/Introduction/Intro";
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
import type { Job } from "./hook/useJob";
import type { UserResponse } from "./hook/useUser";
import type { Department } from "./utils/interfaces";
import Detail_Company from "./components/Detail-Company/Detail_Company";

function App() {

  const dummyItem: Job = {
    _id: "",
    jobTitle: "",
    jobType: "",
    jobLevel: "",
    department: { _id: "", name: "" },
    createBy: { _id: "", fullname: "" },
    requirement: [],
    skills: [],
    benefits: [],
    salary: "",
    location: "",
    address: "",
    workingHours: "",
    jobDescription: [],
    experience: "",
    endDate: "",
    num: 0,
    createdAt: "",
  };

  const dummyCompany: Department = {
    _id: "",
    name: "",
    address: "",
    avatar: "",
    description: "",
    website: "",
  };

  const dummySaveJob = async (userId: string, jobId: string): Promise<UserResponse | void> => {
    const mess = `${userId}${jobId}`;
    return mess as unknown as UserResponse;
  };

  const dummyUnsaveJob = async (userId: string, jobId: string): Promise<UserResponse | void> => {
    const mess = `${userId}${jobId}`;
    return mess as unknown as UserResponse;
  };

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
        {/* <Route path="/jobdetail" element={<JobDetails item={item} saveJob={} />} /> */}
        <Route path="/jobdetail/:id" element={<JobDetails item={dummyItem} saveJob={dummySaveJob} unsaveJob={dummyUnsaveJob} />} />
        <Route path="/companydetail/:id" element={<Detail_Company />} />
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
