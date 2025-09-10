// ModalViewCompany.tsx
import React from "react";
import "./ModalViewCompany.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { HOSTS } from "../../utils/host";

const MySwal = withReactContent(Swal);

interface DepartmentData {
  _id: string;
  name: string;
  address: string;
  description: string;
  website: string;
  avatar: string;
}

interface ModalViewCompanyProps {
  selectedDepartment: DepartmentData | null;
  setSelectedDepartment: React.Dispatch<React.SetStateAction<DepartmentData | null>>;
  onUpdated: () => void; 
}

const ModalViewCompany: React.FC<ModalViewCompanyProps> = ({
  selectedDepartment,
  setSelectedDepartment,
  onUpdated, 
}) => {
  if (!selectedDepartment) return null;

  const handleSave = async () => {
    try {
      await fetch(`${HOSTS.companyService}/update/${selectedDepartment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedDepartment),
      });

      MySwal.fire("Thành công!", "Cập nhật công ty thành công", "success");
      onUpdated();
      setSelectedDepartment(null);
    } catch (err) {
      console.error("Error updating company:", err);
      MySwal.fire("Lỗi!", "Không thể cập nhật công ty.", "error");
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedDepartment(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
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
          <button className="close-btn" onClick={() => setSelectedDepartment(null)}>
            Đóng
          </button>
          <button className="save-btn" onClick={handleSave}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewCompany;