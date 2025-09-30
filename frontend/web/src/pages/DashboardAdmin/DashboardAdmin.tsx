import { useState } from "react";
import "./DashboardAdmin.css";
import AdminHeader from "../../components/dashboardAdmin/header";
import AdminNav from "../../components/dashboardAdmin/nav";
import CompanyList from "../../components/dashboardAdmin/CompanyList";

export const DashboardAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState("Bảng điều khiển");
  const [page, setPage] = useState<
    "dashboard" | "manageUsers" | "manageHR" | "company" | "userTerms" | "hrTerms"
  >("dashboard");

  const adminName = "Administrator";

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
            {page === "userTerms" && <div>📜 Điều khoản người dùng</div>}
            {page === "hrTerms" && <div>📜 Điều khoản HR</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;