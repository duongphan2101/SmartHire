import React, { useState } from "react";
import "../../components/Header/Header";
import "../../components/Footer/Footer";
import "./Dashboard.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import HRheader from "../../components/dashboard-hr/HRheader";
import Nav from "../../components/dashboard-hr/nav";


// interface NavProps {
//   setBreadcrumb: (breadcrumb: string) => void;
// }

export const Dashboard = () => {
  const [breadcrumb, setBreadcrumb] = useState("Dashboard");

  return (
    <div className="App">
      <Header />
      <ChatWithAI />

      <div className="dashboard-layout-container">
        <Nav setBreadcrumb={setBreadcrumb} />
        <div className="main-content-wrapper">
          <HRheader breadcrumb={breadcrumb} />
          <div className="page-content">
            <h2>Dashboard</h2>
            <p>Chào mừng bạn đến với trang quản trị.</p>
          </div>
        </div>
      </div>

      <p>Chào mừng bạn đến với trang quản trị.</p>
      <Footer />
    </div>
  );
};