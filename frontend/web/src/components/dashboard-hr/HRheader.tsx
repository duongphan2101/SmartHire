import React, { useEffect } from "react";
import "./HRheader.css";
import logo from "../../assets/images/logo_v1.png";
import useUser from "../../hook/useUser";

interface HRheaderProps {
  breadcrumb: string;
  setPage: (page: "dashboard" | "about") => void;
}

const HRheader = ({ breadcrumb, setPage }: HRheaderProps) => {

  const { getUser, user } = useUser();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const idToFetch = parsed.user_id ?? parsed._id;
        getUser(idToFetch);
      }
    } catch (e) {
      console.error("Invalid user data in localStorage", e);
    }
  }, [getUser]);

  const handleAbout = () => {
    setPage("about");
  };

  return (
    <div className="main-header">
      <div className="header-left">
        <div className="logo-container">
          <img src={logo} alt="OripioFin Logo" className="logo-image" />
        </div>
        <span className="app-name">SmartHire</span>
        <div className="breadcrumbs">
          {breadcrumb.split(" > ").map((item, index: number, array) => (
            <React.Fragment key={item}>
              <span
                className={`breadcrumb-item ${index === array.length - 1 ? "current" : ""
                  }`}
              >
                {item}
              </span>
              {index < array.length - 1 && (
                <span className="breadcrumb-divider">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="header-right">

        <div className="icon-group">
          <button className="icon-button">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
          <button className="icon-button">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7l.93-.626A2 2 0 005 10h14a2 2 0 001.07-.374L21 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v7z"
              ></path>
            </svg>
          </button>
          <button className="icon-button">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </button>
        </div>

        <div className="user-avatar" onClick={handleAbout}>
          <img src={user?.avatar} alt="User Avatar" className="avatar-image" />
          <button className="avatar-dropdown-button">
            <svg
              className="dropdown-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default HRheader;
