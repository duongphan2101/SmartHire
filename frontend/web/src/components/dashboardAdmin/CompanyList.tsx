import React, { useState } from "react";
import useDepartment from "../../hook/useDepartment";
import "./CompanyList.css";

const CompanyList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { departments, loading, error } = useDepartment("all");

  if (loading) return <p style={{ padding: 20 }}>Đang tải danh sách công ty...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>Lỗi: {error}</p>;

  return (
    <div className="admin-company-profile-container">
      <div className="admin-company-profile-header">
        <div className="admin-search-container">
          <input
            type="text"
            placeholder="Nhập tên công ty"
            className="admin-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-company-list">
        {departments.length === 0 ? (
          <p style={{ padding: 20 }}>Chưa có công ty nào</p>
        ) : (
          departments.map((department) => (
            <div className="admin-company-wrapper" key={department._id}>
              <div className="admin-company-card">
                <img
                  src={department.avatar || "https://via.placeholder.com/150"}
                  alt={department.name}
                  className="admin-company-profile-avatar"
                />
                <div className="admin-company-details">
                  <h3>{department.name}</h3>
                  <p>
                    <strong>Địa chỉ:</strong> {department.address}
                  </p>
                  <p className="admin-company-des">
                    <strong>Mô tả:</strong> {department.description}
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href={department.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {department.website}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyList;