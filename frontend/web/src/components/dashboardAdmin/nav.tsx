import React, { useState } from "react";
import {
  HiOutlineFolder,
  HiOutlineChevronDown,
  HiOutlineChartBar,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineDocumentText,
  HiOutlineNewspaper,
  HiMenu,
  HiOutlineChartSquareBar
} from "react-icons/hi";
import "./nav.css";

interface AdminNavProps {
  setBreadcrumb: (breadcrumb: string) => void;
  setPage: (
    page: "dashboard" | "manageUsers" | "manageHR" | "company" | "userTerms" | "hrTerms" | "post"
  ) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const AdminNav: React.FC<AdminNavProps> = ({
  setBreadcrumb,
  setPage,
  collapsed,
  setCollapsed,
}) => {
  const [isIconMode, setIsIconMode] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Bảng điều khiển");

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIconMode(true);
    setCollapsed(true);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIconMode(false);
    setIsTermsOpen(false);
    setCollapsed(false);
  };

  const handleDropdownClick = (e: React.MouseEvent, menu: string) => {
    e.stopPropagation();
    if (!isIconMode) {
      if (menu === "Điều khoản") {
        setIsTermsOpen(!isTermsOpen);
      }
    }
  };

  const handleItemClick = (item: string, isSubMenu: boolean) => {
    const breadcrumbText = isSubMenu ? `Điều khoản > ${item}` : item;
    setBreadcrumb(breadcrumbText);
    setActiveItem(item);
    if (item === "Bảng điều khiển") setPage("dashboard");
    else if (item === "Bài đăng") setPage("post");
    else if (item === "HR") setPage("manageUsers");
    else if (item === "Công ty") setPage("company");
    else if (item === "Điều khoản người dùng") setPage("userTerms");
    else if (item === "Điều khoản HR") setPage("hrTerms");
  };

  return (
    <div className={`admin-nav-container ${collapsed ? "icon-mode" : ""}`}>
      <div className="admin-project-selector">
        {collapsed ? (
          <HiMenu className="admin-back-icon" onClick={handleBackClick} />
        ) : (
          <div className="admin-project-name-wrapper">
            <HiOutlineFolder className="admin-project-icon" />
            <span>Quản trị viên</span>
            <HiMenu className="admin-dropdown-arrow" onClick={handleMenuClick} />
          </div>
        )}
      </div>

      

      <ul className="admin-nav-menu">
        <li
          className={`admin-nav-item ${activeItem === "Bảng điều khiển" ? "active" : ""}`}
          onClick={() => handleItemClick("Bảng điều khiển", false)}
        >
          <div className="admin-nav-item-content">
            <div className="admin-nav-item-text">
              <HiOutlineChartBar className="admin-nav-item-icon" />
              <span>Bảng điều khiển</span>
            </div>
          </div>
        </li>

        <li
          className={`admin-nav-item ${activeItem === "post" ? "active" : ""}`}
          onClick={() => handleItemClick("Bài đăng", false)}
        >
          <div className="admin-nav-item-content">
            <div className="admin-nav-item-text">
              <HiOutlineChartSquareBar className="admin-nav-item-icon" />
              <span>Bài đăng</span>
            </div>
          </div>
        </li>
        <li
          className={`admin-nav-item ${activeItem === "HR" ? "active" : ""}`}
          onClick={() => handleItemClick("HR", false)}
        >
          <div className="admin-nav-item-content">
            <div className="admin-nav-item-text">
              <HiOutlineBriefcase className="admin-nav-item-icon" />
              <span>Nhà tuyển dụng</span>
            </div>
          </div>
        </li>

        <li
          className={`admin-nav-item ${activeItem === "Công ty" ? "active" : ""}`}
          onClick={() => handleItemClick("Công ty", false)}
        >
          <div className="admin-nav-item-content">
            <div className="admin-nav-item-text">
              <HiOutlineOfficeBuilding className="admin-nav-item-icon" />
              <span>Công ty</span>
            </div>
          </div>
        </li>
      </ul>

      <div className="admin-nav-divider"></div>
      <span className="admin-nav-title">Khác</span>
      <ul className="admin-nav-menu">
        <li
          className={`admin-nav-item with-dropdown ${
            activeItem === "Điều khoản" ? "active" : ""
          }`}
        >
          <div
            className="admin-nav-item-content"
            onClick={(e) => {
              handleDropdownClick(e, "Điều khoản");
              handleItemClick("Điều khoản", false);
            }}
          >
            <div className="admin-nav-item-text">
              <HiOutlineDocumentText className="admin-nav-item-icon" />
              <span>Điều khoản</span>
            </div>
            <HiOutlineChevronDown
              className={`admin-dropdown-arrow ${isTermsOpen ? "open" : ""}`}
            />
          </div>
          {isTermsOpen && !isIconMode && (
            <ul className="admin-sub-menu">
              <li
                className={`admin-sub-menu-item ${
                  activeItem === "Điều khoản người dùng" ? "active" : ""
                }`}
                onClick={() => handleItemClick("Điều khoản người dùng", true)}
              >
                Điều khoản người dùng
              </li>
              <li
                className={`admin-sub-menu-item ${
                  activeItem === "Điều khoản HR" ? "active" : ""
                }`}
                onClick={() => handleItemClick("Điều khoản HR", true)}
              >
                Điều khoản nhà tuyển dụng
              </li>
            </ul>
          )}
        </li>

        <li
          className={`admin-nav-item ${activeItem === "Tin tức mới" ? "active" : ""}`}
          onClick={() => handleItemClick("Tin tức mới", false)}
        >
          <div className="admin-nav-item-content">
            <div className="admin-nav-item-text">
              <HiOutlineNewspaper className="admin-nav-item-icon" />
              <span>Tin tức mới</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AdminNav;