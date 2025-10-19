import { useState } from "react";
import "./DashboardAdmin.css";
import AdminHeader from "../../components/dashboardAdmin/header";
import AdminNav from "../../components/dashboardAdmin/nav";
import CompanyList from "../../components/dashboardAdmin/CompanyList";
import HRterms from "../../components/dashboardAdmin/HRterms";
import UserTerms from "../../components/dashboardAdmin/UserTerms";
import About from "../../components/About-HR/About-hr";

export const DashboardAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState("Bảng điều khiển");
  const [page, setPage] = useState<
    | "dashboard"
    | "manageUsers"
    | "manageHR"
    | "company"
    | "userTerms"
    | "hrTerms"
    | "about"
  >("dashboard");

  const adminName = "ADMIN";

  return (
    <div className="App-Dashboard-Admin">
      <div className="admin-dashboard-layout-container">
        <AdminNav
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setBreadcrumb={setBreadcrumb}
          setPage={setPage}
        />

        <div
          className={`admin-main-content-wrapper ${
            collapsed ? "admin-collapsed" : "admin-expanded"
          }`}
        >
          <AdminHeader
            breadcrumb={breadcrumb}
            setPage={setPage}
            adminName={adminName}
          />
          <div className="admin-page-content">
            {page === "dashboard" && <div>📊 Bảng điều khiển</div>}
            {page === "manageUsers" && <div>👤 HR</div>}
            {page === "company" && <CompanyList />}
            {page === "userTerms" && <UserTerms />}
            {page === "hrTerms" && <HRterms />}
            {page === "about" && <About />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
