import { useState } from "react";
import "../../components/Header/Header";
import "../../components/Footer/Footer";
import "./Dashboard.css";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import HRheader from "../../components/dashboard-hr/HRheader";
import Nav from "../../components/dashboard-hr/nav";
import About from "../../components/About-HR/about-hr";


// interface NavProps {
//   setBreadcrumb: (breadcrumb: string) => void;
// }

export const Dashboard = () => {
  const [breadcrumb, setBreadcrumb] = useState("Dashboard");
  const [page, setPage] = useState<"dashboard" | "about">("dashboard");

  return (
    <div className="App">
      <ChatWithAI />

      <div className="dashboard-layout-container">
        <Nav setBreadcrumb={setBreadcrumb} />

        <div className="main-content-wrapper">
          <HRheader breadcrumb={breadcrumb} setPage={setPage}/>
          <div className="page-content">
            {page === "dashboard" && (
              <>
                <h2>Dashboard</h2>
                <p>Chào mừng bạn đến với trang quản trị.</p>
              </>
            )}
            {page === "about" && <About />}
          </div>
        </div>

      </div>
    </div>
  );
};