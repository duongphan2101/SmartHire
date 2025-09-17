import React, { useState } from "react";
import {
  HiOutlineFolder,
  HiOutlineChevronDown,
  HiOutlineMenuAlt3,
  HiOutlineAdjustments,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineDotsCircleHorizontal,
  HiMenu,
} from "react-icons/hi";
import "./nav.css";

// Định nghĩa interface cho props
interface NavProps {
  setBreadcrumb: (breadcrumb: string) => void;
  setPage: (
    page: "dashboard" | "about" | "company" | "jobPost" | "allJobPost"
  ) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const Nav = ({ setBreadcrumb, setPage, collapsed, setCollapsed }: NavProps) => {
  const [isIconMode, setIsIconMode] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Xử lý sự kiện khi nhấn vào biểu tượng menu
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIconMode(true);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIconMode(false);
    setIsWorkOpen(false);
  };

  const handleDropdownClick = (e: React.MouseEvent, menu: string) => {
    e.stopPropagation();
    if (!isIconMode) {
      if (menu === "Công việc") {
        setIsWorkOpen(!isWorkOpen);
      }
    }
  };

  const handleItemClick = (item: string, isSubMenu: boolean) => {
    const breadcrumbText = isSubMenu ? `Công việc > ${item}` : item;
    setBreadcrumb(breadcrumbText);
    setActiveItem(item);
    if (item === "Công ty") setPage("company");
    else if (item === "Dashboard") setPage("dashboard");
    else if (item === "Công việc đã đăng") setPage("jobPost");
    else if (item === "Tất cả công việc") setPage("allJobPost");
  };

  return (
    <div className={`nav-container ${collapsed ? "icon-mode" : ""}`}>
      {/* Project Selection */}
      <div className="nav-section project-selector">
        {collapsed ? (
          <HiMenu className="back-icon" onClick={() => setCollapsed(false)} />
        ) : (
          <div className="project-name-wrapper">
            <HiOutlineFolder className="project-icon" />
            <span >Dự án chung</span>
            <HiMenu
              className="dropdown-arrow"
              onClick={() => setCollapsed(true)}
            />
          </div>
        )}
      </div>

      {/* Main Navigation Menu */}
      <ul className="nav-menu">
        <li
          className={`nav-item ${activeItem === "Bảng điều khiển" ? "active" : ""}`}
          onClick={() => handleItemClick("Bảng điều khiển", false)}
        >
          <div className="nav-item-content">
            <div className="nav-item-text">
              <HiOutlineMenuAlt3 className="nav-item-icon" />
              <span>Bảng điều khiển</span>
            </div>
          </div>
        </li>

        <li
          className={`nav-item with-dropdown ${
            activeItem === "Công việc" ? "active" : ""
          }`}
        >
          <div
            className="nav-item-content"
            onClick={(e) => {
              handleDropdownClick(e, "Công việc");
              handleItemClick("Công việc", false);
            }}
          >
            <div className="nav-item-text">
              <HiOutlineAdjustments className="nav-item-icon" />
              <span>Công việc</span>
            </div>
            <HiOutlineChevronDown
              className={`dropdown-arrow ${isWorkOpen ? "open" : ""}`}
            />
          </div>
          {isWorkOpen && !isIconMode && (
            <ul className="sub-menu">
              <li
                className={`sub-menu-item ${
                  activeItem === "Tất cả công việc" ? "active" : ""
                }`}
                onClick={() => handleItemClick("Tất cả công việc", true)}
              >
                Tất cả công việc
              </li>
              <li
                className={`sub-menu-item ${
                  activeItem === "Công việc đã đăng" ? "active" : ""
                }`}
                onClick={() => handleItemClick("Công việc đã đăng", true)}
              >
                Công việc đã đăng
              </li>
            </ul>
          )}
        </li>

        <li
          className={`nav-item ${activeItem === "Công ty" ? "active" : ""}`}
          onClick={() => handleItemClick("Công ty", false)}
        >
          <div className="nav-item-content">
            <div className="nav-item-text">
              <HiOutlineClock className="nav-item-icon" />
              <span>Công ty</span>
            </div>
          </div>
        </li>
      </ul>

      {/* Other Menus */}
      <div className="nav-divider"></div>
      <span className="nav-title">Khác</span>
      <ul className="nav-menu">
        <li
          className={`nav-item ${
            activeItem === "Học tập & Đào tạo" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Học tập & Đào tạo", false)}
        >
          <div className="nav-item-content">
            <div className="nav-item-text">
              <HiOutlineUser className="nav-item-icon" />
              <span style={{ fontSize: "15px" }}>Học tập & Đào tạo</span>
            </div>
          </div>
        </li>

        <li
          className={`nav-item ${activeItem === "Tin tức mới" ? "active" : ""}`}
          onClick={() => handleItemClick("Tin tức mới", false)}
        >
          <div className="nav-item-content">
            <div className="nav-item-text">
              <HiOutlineDotsCircleHorizontal className="nav-item-icon" />
              <span>Tin tức mới</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
