import { useState } from "react";
// Import các components biểu đồ nếu chúng nằm ở đây, hoặc di chuyển chúng vào DashboardContent
// import AreaBaseline from "../../components/dashboardAdmin/AreaBaseLine";
// import PieChart from "../../components/dashboardAdmin/PieChart";
// import BarChart from "../../components/dashboardAdmin/BarChart";

import "./DashboardAdmin.css";
import AdminHeader from "../../components/dashboardAdmin/header";
import AdminNav from "../../components/dashboardAdmin/nav";
import CompanyList from "../../components/dashboardAdmin/CompanyList";
import HRterms from "../../components/dashboardAdmin/HRterms";
import UserTerms from "../../components/dashboardAdmin/UserTerms";
import About from "../../components/About-HR/About-hr";
import DashboardContent from "../../components/dashboardAdmin/dashboardAdmin"; 
import HRList from "../../components/dashboardAdmin/HRList";

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
                        {/* SỬA LỖI: Sử dụng tên component đã đổi tên */}
                        {page === "dashboard" && <DashboardContent />} 
                        
                        {page === "manageUsers" && <HRList />}
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