// Company.tsx
import "./Company.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaEye, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react"; // thêm useEffect
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useDepartment from "../../hook/useDepartment";
import ModalViewCompany from "../dashboard-hr/ModalViewCompany";
import { AddDepartmentmodal } from "../dashboard-hr/AddDerpartmentmodal";

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
  const { department } = useDepartment(); // vẫn giữ nguyên
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ✅ thêm state lưu nhiều department
  const [departments, setDepartments] = useState<DepartmentData[]>([]);

  // ✅ hàm fetch danh sách
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${HOSTS.companyService}/getAll`);
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // ✅ load danh sách khi mount
  useEffect(() => {
    fetchDepartments();
  }, []);

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
        fetchDepartments(); // ✅ load lại sau khi xóa
      } catch (err) {
        console.error("Error deleting company:", err);
        MySwal.fire("Lỗi!", "Không thể xóa công ty.", "error");
      }
    }
  };

  const handleCreateDepartment = async () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewDepartment = async (data: {
    name: string;
    address: string;
    description: string;
    website: string;
    avatar: string;
    employees: string[];
  }) => {
    try {
      const response = await fetch(`${HOSTS.companyService}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        MySwal.fire("Thành công!", "Phòng ban đã được tạo.", "success");
        setIsAddModalOpen(false);
        fetchDepartments(); // ✅ load lại danh sách sau khi thêm
      } else {
        throw new Error("Failed to create department");
      }
    } catch (err) {
      console.error("Error creating department:", err);
      MySwal.fire("Lỗi!", "Không thể tạo phòng ban.", "error");
    }
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
        {/* ✅ hiển thị danh sách departments */}
        {departments.length > 0 ? (
          departments
            .filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((dep) => (
              <div className="company-wrapper" key={dep._id}>
                <div className="company-card">
                  <img
                    src={dep.avatar}
                    alt={dep.name}
                    className="company-profile-avatar"
                  />
                  <div className="company-details">
                    <h3>{dep.name}</h3>
                    <p>
                      <strong>Address:</strong> {dep.address}
                    </p>
                    <p>
                      <strong>Description:</strong> {dep.description}
                    </p>
                    <p>
                      <strong>Website:</strong>{" "}
                      <a href={dep.website} target="_blank" rel="noopener noreferrer">
                        {dep.website}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="company-actions">
                  <button
                    className="view-btn"
                    onClick={() => setSelectedDepartment(dep)}
                  >
                    <FaEye /> Xem
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(dep._id)}
                  >
                    <FaTrash /> Xóa
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p style={{ padding: 20 }}>
            Bạn đang không thuộc công ty nào, có thể tạo một công ty hoặc có thể liên hệ các HR cùng công ty để được thêm vào công ty hiện có!
          </p>
        )}
      </div>

      <ModalViewCompany
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        onUpdated={fetchDepartments}
      />

      {isAddModalOpen && (
        <AddDepartmentmodal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveNewDepartment}
        />
      )}
    </div>
  );
};

export default Company;
