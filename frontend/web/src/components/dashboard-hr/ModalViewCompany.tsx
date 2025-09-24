import React, { useState, useEffect } from "react";
import "./ModalViewCompany.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { HOSTS } from "../../utils/host";
import { uploadToCloudinary } from "../../utils/cloudinary";

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
  setSelectedDepartment: React.Dispatch<
    React.SetStateAction<DepartmentData | null>
  >;
  onUpdated: () => void;
}

const ModalViewCompany: React.FC<ModalViewCompanyProps> = ({
  selectedDepartment,
  setSelectedDepartment,
  onUpdated,
}) => {
  const [localDept, setLocalDept] = useState<DepartmentData | null>(
    selectedDepartment
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setLocalDept(selectedDepartment);
    setPreviewUrl(selectedDepartment?.avatar || null);
    setAvatarFile(null);
  }, [selectedDepartment]);

  if (!localDept) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!localDept) return;

    try {
      let avatarUrl = localDept.avatar;
      if (avatarFile) {
        avatarUrl = await uploadToCloudinary(avatarFile);
      }

      const payload = { ...localDept, avatar: avatarUrl };

      await fetch(`${HOSTS.companyService}/update/${localDept._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
            value={localDept.name}
            onChange={(e) =>
              setLocalDept({ ...localDept, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            value={localDept.address}
            onChange={(e) =>
              setLocalDept({ ...localDept, address: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            className="info-input-area"
            value={localDept.description}
            onChange={(e) =>
              setLocalDept({ ...localDept, description: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Website</label>
          <input
            type="text"
            value={localDept.website}
            onChange={(e) =>
              setLocalDept({ ...localDept, website: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Ảnh đại diện</label>
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="file-input"
              id="avatar-upload"
            />
          </div>
        </div>
        {avatarFile && <p className="file-name">{avatarFile.name}</p>}
        {previewUrl && (
          <img src={previewUrl} alt="preview" className="avatar-preview" />
        )}
        <div className="modal-actions">
          <button
            className="close-btn"
            onClick={() => setSelectedDepartment(null)}
          >
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
