import { useState } from "react";
import "./DashboardAdmin.css";
import AdminHeader from "../../components/dashboardAdmin/header";
import AdminNav from "../../components/dashboardAdmin/nav";
import CompanyList from "../../components/dashboardAdmin/CompanyList";
import HRterms from "../../components/dashboardAdmin/HRterms";
import UserTerms from "../../components/dashboardAdmin/UserTerms";
import About from "../../components/About-HR/About-hr";
import DashboardContent from "../../components/dashboardAdmin/dashboardAdmin"; // Import component con vừa sửa
import HRList from "../../components/dashboardAdmin/HRList";
// Hãy chắc chắn đây là PostAdmin.tsx mà chúng ta đã sửa trước đó (có logic highlight)
import Post from "../../components/dashboardAdmin/Post"; 

export const DashboardAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState("Bảng điều khiển");
  const [page, setPage] = useState("dashboard");

  // State được "Lift Up" lên đây
  const [activeReportJobId, setActiveReportJobId] = useState("");
  const [activeReportStatus, setActiveReportStatus] = useState("");

  return (
    <div className="App-Dashboard-Admin">
      <div className="admin-dashboard-layout-container">
        <AdminNav
          currentPage={page}
          setPage={setPage}
          setBreadcrumb={setBreadcrumb}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className={`admin-main-content-wrapper ${collapsed ? "admin-collapsed" : "admin-expanded"}`}>
          <AdminHeader breadcrumb={breadcrumb} setPage={setPage} adminName="ADMIN" />

          <div className="admin-page-content">

            {/* Khi ở trang Dashboard, truyền hàm SetState xuống cho con dùng */}
            {page === "dashboard" && (
              <DashboardContent
                page={page}
                setPage={setPage}
                setActiveReportJobId={setActiveReportJobId}
                setActiveReportStatus={setActiveReportStatus}
              />
            )}

            {/* Khi page là 'post', render Post component và truyền ID cần highlight vào */}
            {page === "post" && (
              <Post
                // Key quan trọng để reset component khi ID thay đổi
                key={activeReportJobId || 'default-post'} 
                idPostActive={activeReportJobId}
                status={activeReportStatus}
              />
            )}

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