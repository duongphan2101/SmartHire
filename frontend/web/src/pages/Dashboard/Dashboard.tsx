import { useState } from "react";
import "../../components/Header/Header";
import "../../components/Footer/Footer";
import "./Dashboard.css";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import HRheader from "../../components/dashboard-hr/HRheader";
import Nav from "../../components/dashboard-hr/nav";
import About from "../../components/About-HR/About-hr";
import CompanyContent from "../../pages/Company/CompanyContent";
import AddJobmodal from "../../components/dashboard-hr/AddJobmodal";

// interface NavProps {
//   setBreadcrumb: (breadcrumb: string) => void;
// }

export const Dashboard = () => {
  const [breadcrumb, setBreadcrumb] = useState("Dashboard");
  const [page, setPage] = useState<"dashboard" | "about" | "company">("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddClick = () => {
    setIsModalOpen(true); //
  };
  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };
  return (
    <div className="App">
      <ChatWithAI />

      <div className="dashboard-layout-container">
        <Nav setBreadcrumb={setBreadcrumb} setPage={setPage} />

        <div className="main-content-wrapper">
          <HRheader breadcrumb={breadcrumb} setPage={setPage} />
          <div className="page-content">
            {page === "dashboard" && (
              <>
                <div className="search-wrapper"> 
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search"
                      className="search-input"
                    />
                    <button className="add-button" onClick={handleAddClick}>
                      Thêm
                    </button>
                  </div>
                </div>
                {isModalOpen && <AddJobmodal onClose={handleCloseModal} />}
              </>
            )}
            {page === "about" && <About />}
            {page === "company" && <CompanyContent />}
          </div>
        </div>
      </div>
    </div>
  );
};