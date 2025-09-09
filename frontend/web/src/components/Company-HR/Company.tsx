import "./Company.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaEye, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useDepartment from "../../hook/useDepartment";

const MySwal = withReactContent(Swal);

interface DepartmentData {
  _id: string;
  name: string;
  address: string;
  description: string;
  website: string;
  avatar: string;
}

const Company: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null);
  const { department } = useDepartment();

  const handleDelete = async (id: string) => {
    console.log(`ID Department: ${id}`);
    const confirm = await MySwal.fire({
      title: "Bạn chắc chắn?",
      text: "Công ty này sẽ bị xóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`${HOSTS.companyService}/delete/${id}`, {
          method: "DELETE",
        });
        MySwal.fire("Đã xóa!", "Công ty đã được xóa.", "success");
        // TODO: reload lại state nếu cần
      } catch (err) {
        console.error("Error deleting company:", err);
        MySwal.fire("Lỗi!", "Không thể xóa công ty.", "error");
      }
    }
  };

  const handleCreateDepartment = async () => {
    alert(`HEHE`);
  };

  return (
    <div className="company-profile-container">

      <div className="company-profile-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Nhập tên công ty"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-button" onClick={handleCreateDepartment}>
            <AiOutlinePlusCircle size={20} />
            Thêm
          </button>
        </div>
      </div>

      <div className="company-list">
        {department && department._id ? (
          <div className="company-wrapper">
            <div className="company-card">
              <img
                src={department.avatar}
                alt={department.name}
                className="company-profile-avatar"
              />
              <div className="company-details">
                <h3>{department.name}</h3>
                <p>
                  <strong>Address:</strong> {department.address}
                </p>
                <p>
                  <strong>Description:</strong> {department.description}
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

            <div className="company-actions">
              <button
                className="view-btn"
                onClick={() => setSelectedDepartment(department)}
              >
                <FaEye /> Xem
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(department._id)}
              >
                <FaTrash /> Xóa
              </button>
            </div>
          </div>
        ) : (
          <p style={{padding: 20}}>Bạn đang không thuộc công ty nào, có thể tạo một công ty hoặc có thể liên hệ các HR cùng công tuy để được thêm vào công ty hiện có!</p>
        )}

      </div>

      {/* Modal View */}
      {selectedDepartment && (
        <div className="modal-overlay" onClick={() => setSelectedDepartment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="text-left text-2xl font-bold" style={{paddingBottom: 40, paddingTop: 20}}>
            <h2>Chỉnh sửa công ty</h2>
            </div>

            <div className="form-group">
              <label>Tên công ty</label>
              <input
                type="text"
                value={selectedDepartment.name}
                onChange={(e) =>
                  setSelectedDepartment({ ...selectedDepartment, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                value={selectedDepartment.address}
                onChange={(e) =>
                  setSelectedDepartment({ ...selectedDepartment, address: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <input
                type="text"
                value={selectedDepartment.description}
                onChange={(e) =>
                  setSelectedDepartment({ ...selectedDepartment, description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="text"
                value={selectedDepartment.website}
                onChange={(e) =>
                  setSelectedDepartment({ ...selectedDepartment, website: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="text"
                value={selectedDepartment.avatar}
                onChange={(e) =>
                  setSelectedDepartment({ ...selectedDepartment, avatar: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setSelectedDepartment(null)}>Đóng</button>
              <button
                onClick={async () => {
                  try {
                    await fetch(`${HOSTS.companyService}/update/${selectedDepartment._id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(selectedDepartment),
                    });

                    MySwal.fire("Thành công!", "Cập nhật công ty thành công", "success");
                    setSelectedDepartment(null);
                  } catch (err) {
                    console.error("Error updating company:", err);
                    MySwal.fire("Lỗi!", "Không thể cập nhật công ty.", "error");
                  }
                }}
                className="save-btn"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;
