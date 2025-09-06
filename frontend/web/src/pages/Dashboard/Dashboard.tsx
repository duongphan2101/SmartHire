import { useState } from "react";
import "../../components/Header/Header";
import "../../components/Footer/Footer";
import "./Dashboard.css";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import HRheader from "../../components/dashboard-hr/HRheader";
import Nav from "../../components/dashboard-hr/nav";
import About from "../../components/About-HR/About-hr";
import CompanyContent from "../Company/CompanyContent";
import JobPost from "../../components/dashboard-hr/JobPost";
import google from "../../assets/images/google.png";

// interface NavProps {
//   setBreadcrumb: (breadcrumb: string) => void;
// }
export const Dashboard = () => {
  const [breadcrumb, setBreadcrumb] = useState("Dashboard");
  const [page, setPage] = useState<"dashboard" | "about" | "company" | "jobPost">("dashboard");

  return (
    <div className="App">
      <ChatWithAI />

      <div className="dashboard-layout-container">
        <Nav setBreadcrumb={setBreadcrumb} setPage={setPage} />

        <div className="main-content-wrapper">
        <HRheader breadcrumb={breadcrumb} setPage={setPage}  />
          <div className="page-content">
            {page === "dashboard" && (
              <>
               
              </>
            )}
            {page === "about" && <About />}
            {page === "company" && <CompanyContent />} 
            {page === "jobPost" && <JobPost />}
          </div>
        </div>
      </div>
    </div>
  );
};