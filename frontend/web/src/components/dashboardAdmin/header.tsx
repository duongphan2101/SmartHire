import React, { useEffect, useState, useRef } from "react";
import "./header.css";
import logo from "../../assets/images/logo_v1.png";
import useUser from "../../hook/useUser";

interface AdminHeaderProps {
  breadcrumb: string;
  setPage: (
    page: "dashboard" | "manageUsers" | "manageHR" | "company" | "userTerms" | "hrTerms" | "about"
  ) => void;
  adminName: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ breadcrumb, setPage, adminName }) => {
  const { getUser, user } = useUser();
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const storedAvatar = localStorage.getItem("adminAvatar");
      if (storedAvatar) {
        setAdminAvatar(storedAvatar);
      }
    } catch (e) {
      console.error("Lỗi khi tải avatar từ localStorage", e);
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const idToFetch = parsed.user_id ?? parsed._id;
        getUser(idToFetch);
      }
    } catch (e) {
      console.error("Dữ liệu người dùng trong localStorage không hợp lệ", e);
    }
  }, [getUser]);

  // const handleUserTerms = () => {
  //   setPage("userTerms");
  // };

  // const handleAvatarClick = () => {
  //   fileInputRef.current?.click();
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        setAdminAvatar(newAvatar);
        localStorage.setItem("adminAvatar", newAvatar);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAbout = () => setPage("about");

  return (
    <div className="admin-main-header">
      <div className="admin-header-left">
        <div className="admin-logo-container">
          <img src={logo} alt="OripioFin Logo" className="admin-logo-image" />
        </div>
        <span className="admin-app-name">SmartHire</span>
        <div className="admin-breadcrumbs">
          {breadcrumb.split(" > ").map((item, index: number, array) => (
            <React.Fragment key={item}>
              <span
                className={`admin-breadcrumb-item ${index === array.length - 1 ? "current" : ""
                  }`}
              >
                {item}
              </span>
              {index < array.length - 1 && (
                <span className="admin-breadcrumb-divider">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="admin-header-right">
        <span style={{ fontSize: "18px" }}>{adminName}</span>
        <div className="admin-icon-group">
          <button className="admin-icon-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                fill="currentColor"
                d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zm-2 0v-7a6 6 0 1 0-12 0v7h12zm-9 4h6v2H9v-2z"
              ></path>
            </svg>
          </button>
        </div>

        <div className="admin-user-avatar" onClick={handleAbout}>
          <img
            src={adminAvatar || user?.avatar}
            alt="Admin Avatar"
            className="admin-avatar-image"
          />
          <button className="admin-avatar-dropdown-button">
            <svg
              className="admin-dropdown-icon"
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
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default AdminHeader;