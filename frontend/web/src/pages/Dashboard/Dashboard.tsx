import { useState } from "react";
import "../../components/Header/Header";
import "../../components/Footer/Footer";
import "./Dashboard.css";
// import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import HRheader from "../../components/dashboard-hr/HRheader";
import Nav from "../../components/dashboard-hr/nav";
import About from "../../components/About-HR/About-hr";
import CompanyContent from "../Company/CompanyContent";
import AllJobPost from "../../components/dashboard-hr/AllJobPost";
import JobPost from "../../components/dashboard-hr/JobPost";
import Dashboard_HR from "../../components/Dashboard/Dashboard";
import useDepartment from "../../hook/useDepartment";
import Payment from "../../components/Payment/Payment";
import TermHR from "../../components/dashboard-hr/TermHR";

export const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState("Dashboard");
  const [page, setPage] = useState<
    "dashboard" | "about" | "company" | "jobPost" | "allJobPost" | "payment" | "termHr"
  >("dashboard");

  const { department } = useDepartment();
  const companyName = department?.name || "SmartHire";

  return (
    <div className="App-Dashboard">
      <div className="dashboard-layout-container">
        <Nav
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setBreadcrumb={setBreadcrumb}
          setPage={setPage}
        />

        <div
          className={`main-content-wrapper ${
            collapsed ? "collapsed" : "expanded"
          }`}
        >
          <HRheader
            breadcrumb={breadcrumb}
            setPage={setPage}
            companyName={companyName}
          />
          <div className="page-content bg-gray-50">
            {page === "dashboard" && <Dashboard_HR />}
            {page === "about" && <About />}
            {page === "company" && <CompanyContent />}
            {page === "allJobPost" && <AllJobPost />}
            {page === "jobPost" && <JobPost />}
            {page === "payment" && <Payment />}
            {page === "termHr" && <TermHR />}
          </div>
        </div>
      </div>
    </div>
  );
};
