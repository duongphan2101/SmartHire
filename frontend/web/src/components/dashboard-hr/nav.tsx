import React, { useState } from "react";
import {
  HiOutlineFolder,
  HiOutlineChevronDown,
  HiOutlineSearch,
  HiOutlineMenuAlt3,
  HiOutlineAdjustments,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineDotsCircleHorizontal,
  HiMenu,
} from "react-icons/hi";
import "./Nav.css";

// Định nghĩa interface cho props
interface NavProps {
  setBreadcrumb: (breadcrumb: string) => void;
}

const Nav = ({ setBreadcrumb }: NavProps) => {
  const [isIconMode, setIsIconMode] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Xử lý sự kiện khi nhấn vào biểu tượng menu nha
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIconMode(true);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIconMode(false);
    setIsDashboardOpen(false);
  };

  const handleDropdownClick = (e: React.MouseEvent, menu: string) => {
    e.stopPropagation();
    if (!isIconMode) {
      if (menu === "Dashboard") {
        setIsDashboardOpen(!isDashboardOpen);
      }
    }
  };

  const handleItemClick = (item: string, isSubMenu: boolean) => {
    const breadcrumbText = isSubMenu ? `Dashboard > ${item}` : item;
    setBreadcrumb(breadcrumbText);
    setActiveItem(item);
  };

  return (
    <div className={`nav-container ${isIconMode ? "icon-mode" : ""}`}>
      {/* Project Selection */}
      <div className="nav-section project-selector">
        {isIconMode ? (
          <HiMenu className="back-icon" onClick={handleBackClick} />
        ) : (
          <div className="project-name-wrapper">
            <HiOutlineFolder className="project-icon" />
            <span>Default project</span>
          </div>
        )}
        {!isIconMode && (
          <HiMenu className="dropdown-arrow" onClick={handleMenuClick} />
        )}
      </div>

      {/* Search Input */}
      <div className="search-container">
        <HiOutlineSearch className="search-icon" />
        <input type="text" placeholder="Search" className="search-input" />
      </div>

      {/* Main Navigation Menu */}
      <ul className="nav-menu">
        <li
          className={`nav-item with-dropdown ${
            activeItem === "Dashboard" ? "active" : ""
          }`}
        >
          <div
            className="nav-item-content"
            onClick={(e) => {
              handleDropdownClick(e, "Dashboard");
              handleItemClick("Dashboard", false);
            }}
          >
            <div className="nav-item-text">
              <HiOutlineMenuAlt3 className="nav-item-icon" />
              <span>Dashboard</span>
            </div>
            <HiOutlineChevronDown
              className={`dropdown-arrow ${isDashboardOpen ? "open" : ""}`}
            />
          </div>
          {isDashboardOpen && !isIconMode && (
            <ul className="sub-menu">
              <li
                className={`sub-menu-item ${
                  activeItem === "Generate Articles" ? "active" : ""
                }`}
                onClick={() => handleItemClick("Generate Articles", true)}
              >
                Generate Articles
              </li>
              <li
                className={`sub-menu-item ${
                  activeItem === "History" ? "active" : ""
                }`}
                onClick={() => handleItemClick("History", true)}
              >
                History
              </li>
              <li
                className={`sub-menu-item ${
                  activeItem === "All Articles" ? "active" : ""
                }`}
                onClick={() => handleItemClick("All Articles", true)}
              >
                All Articles
              </li>
              <li
                className={`sub-menu-item ${
                  activeItem === "AI SEO Editor" ? "active" : ""
                }`}
                onClick={() => handleItemClick("AI SEO Editor", true)}
              >
                AI SEO Editor
              </li>
            </ul>
          )}
        </li>

        <li
          className={`nav-item ${
            activeItem === "Customization" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Customization", false)}
        >
          <div className="nav-item-content">
            <div className="nav-item-text">
              <HiOutlineAdjustments className="nav-item-icon" />
              <span>Customization</span>
            </div>
          </div>
        </li>

        <li
          className={`nav-item ${
            activeItem === "Blog Automation" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Blog Automation", false)}
        >
          <div className="nav-item-content">
            <div className="nav-item-text">
              <HiOutlineClock className="nav-item-icon" />
              <span>Blog Automation</span>
            </div>
          </div>
        </li>
      </ul>

      {/* Other Menus */}
      <div className="nav-divider"></div>
      <span className="nav-title">Others</span>
      <ul className="nav-menu">
        <li
          className={`nav-item ${
            activeItem === "Learn & Training" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Learn & Training", false)}
        >
          <div className="nav-item-content">
            <div className="nav-item-text">
              <HiOutlineUser className="nav-item-icon" />
              <span>Learn & Training</span>
            </div>
          </div>
        </li>

        <li
          className={`nav-item ${activeItem === "What's New" ? "active" : ""}`}
          onClick={() => handleItemClick("What's New", false)}
        >
          <div className="nav-item-content">
            <div className="nav-item-text">
              <HiOutlineDotsCircleHorizontal className="nav-item-icon" />
              <span>What's New</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
