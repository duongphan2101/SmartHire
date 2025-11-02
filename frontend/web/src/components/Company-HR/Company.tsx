import "./Company.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaEye, FaTrash } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useDepartment, { type DepartmentData } from "../../hook/useDepartment";
import ModalViewCompany from "../dashboard-hr/ModalViewCompany";
import { AddDepartmentmodal } from "../dashboard-hr/AddDerpartmentmodal";

const MySwal = withReactContent(Swal);

const Company: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { department, loading, error, createDepartment, deleteDepartment, refetch } = useDepartment("user");

  const handleDelete = async (id: string) => {
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
        await deleteDepartment(id);
        MySwal.fire("Đã xóa!", "Công ty đã được xóa.", "success");
      } catch {
        MySwal.fire("Lỗi!", "Không thể xóa công ty.", "error");
      }
    }
  };

  const handleSaveNewDepartment = async (data: Omit<DepartmentData, "_id"> & { employees: string[] }) => {
    try {
      await createDepartment(data);
      MySwal.fire("Thành công!", "Phòng ban đã được tạo.", "success");
      setIsAddModalOpen(false);
    } catch {
      MySwal.fire("Lỗi!", "Không thể tạo phòng ban.", "error");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Đang tải danh sách công ty...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>Lỗi: {error}</p>;

  return (
    <div className="company-profile-container shadow-xl">
      <div className="company-profile-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Nhập tên công ty"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
            <AiOutlinePlusCircle size={20} />
            Thêm
          </button>
        </div>
      </div>

      <div className="company-list">
        {department && department._id ? (
          <div className="company-wrapper" key={department._id}>
            <div className="company-card">
              <img
                src={department.avatar}
                alt={department.name}
                className="company-profile-avatar"
              />
              <div className="company-details">
                <h3>{department.name}</h3>
                <p>
                  <strong>Địa chỉ:</strong> {department.address}
                </p>
                <p className="company-des">
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
          <p style={{ padding: 20 }}>
            Bạn đang không thuộc công ty nào, có thể tạo một công ty hoặc liên hệ HR
            để được thêm vào công ty hiện có!
          </p>
        )}
      </div>


      <ModalViewCompany selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} onUpdated={refetch} />

      {isAddModalOpen && (
        <AddDepartmentmodal onClose={() => setIsAddModalOpen(false)} onSave={handleSaveNewDepartment} />
      )}
    </div>
  );
};

export default Company;
