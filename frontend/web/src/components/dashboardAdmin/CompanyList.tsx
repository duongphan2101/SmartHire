import React, { useState } from "react";
import useDepartment, { type DepartmentStatus } from "../../hook/useDepartment";
import Swal from "sweetalert2";
import "./CompanyList.css";

const CompanyList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { departments, loading, error, updateDepartmentStatus } = useDepartment("all");

  const handleStatusChange = async (id: string, newStatus: DepartmentStatus) => {
    const statusMap: { [key: string]: string } = {
      Active: "Hoạt động",
      Suspended: "Tạm khóa",
      Archived: "Lưu trữ",
    };

    const result = await Swal.fire({
      title: "Xác nhận thay đổi trạng thái",
      text: `Bạn có chắc chắn muốn chuyển trạng thái công ty sang "${statusMap[newStatus]}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có, thay đổi!",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: false,
    });

    if (result.isConfirmed) {
      try {
        await updateDepartmentStatus(id, newStatus);
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          text: `Công ty hiện ở trạng thái: ${statusMap[newStatus]}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (e) {
        console.error("Lỗi cập nhật trạng thái:", e);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Lỗi khi cập nhật trạng thái công ty. Vui lòng thử lại.",
        });
      }
    }
  };

  // Lọc danh sách công ty theo tìm kiếm
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredDepartments.length === 0 ? (
          <p style={{ padding: 20 }}>Không tìm thấy công ty nào phù hợp.</p>
        ) : (
          filteredDepartments.map((department) => (
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
                    <a href={department.website} target="_blank" rel="noopener noreferrer">
                      {department.website}
                    </a>
                  </p>
                </div>

                <div className="admin-company-status-control">
                  <p>
                    <strong>Trạng thái:</strong>
                    <span
                      style={{
                        fontWeight: "bold",
                        marginLeft: "5px",
                        color:
                          department.status === "Suspended"
                            ? "red"
                            : department.status === "Archived"
                            ? "gray"
                            : "green",
                      }}
                    >
                      {department.status === "Active"
                        ? "Hoạt động"
                        : department.status === "Suspended"
                        ? "Tạm khóa"
                        : "Lưu trữ"}
                    </span>
                  </p>
                  <select
                    value={department.status}
                    onChange={(e) =>
                      handleStatusChange(department._id, e.target.value as DepartmentStatus)
                    }
                    style={{
                      padding: "8px",
                      width: "180px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Suspended">Tạm khóa</option>
                    {/* <option value="Archived">Lưu trữ</option> */}
                  </select>
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
