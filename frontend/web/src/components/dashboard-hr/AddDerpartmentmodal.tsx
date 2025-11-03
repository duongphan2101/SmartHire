import React, { useState, useEffect } from "react";
import "./AddDerpartmentmodal.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToCloudinary } from "../../utils/cloudinary";
import useUser from "../../hook/useUser";
import type { DepartmentStatus } from "../../hook/useDepartment";

interface AddDerpartmentmodalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    address: string;
    description: string;
    website: string;
    avatar: string;
    employees: string[];
    status: DepartmentStatus;
  }) => void;
}

export const AddDepartmentmodal: React.FC<AddDerpartmentmodalProps> = ({
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<DepartmentStatus>('Active');
  const { getUser, user, loadingUser, errorUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const userId = parsed.user_id ?? parsed._id;
        setStatus('Active');
        if (userId) {
          await getUser(userId);
        }
      }
    };
    fetchUser();
  }, [getUser]);

  // Avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !address.trim() || !description.trim() || !website.trim() || !avatar) {
      toast.error("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }

    if (loadingUser || errorUser) {
      toast.error("Lỗi khi lấy thông tin người dùng!");
      return;
    }

    try {
      // Upload avatar lên Cloudinary
      const avatarUrl = await uploadToCloudinary(avatar);

      // Lấy _id từ user hiện tại
      const userId = user?._id || "";

      const employees = userId ? [userId] : [];
      const payload = {
        name,
        address,
        description,
        website,
        avatar: avatarUrl,
        employees,
        status,
      };

      onSave(payload);
      toast.success("Tạo phòng ban thành công");
      onClose();
    } catch (err) {
      toast.error("Upload ảnh thất bại!");
    }
  };

  return (
    <div className="modal" onDoubleClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <p className="font-bold text-2xl">Thêm công ty</p>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Thông tin chung */}
            <div className="section-container">
              {/* <h3>Thông tin chung</h3> */}
              <div className="input-container">
                <input
                  required
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className="label" htmlFor="name">
                  Tên công ty
                </label>
                <div className="underline"></div>
              </div>
              <div className="input-container">
                <input
                  required
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <label className="label" htmlFor="address">
                  Địa chỉ
                </label>
                <div className="underline"></div>
              </div>
              <div className="input-container">
                <input
                  required
                  id="website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <label className="label" htmlFor="website">
                  Website
                </label>
                <div className="underline"></div>
              </div>
              <div className="input-container">
                <input
                  required
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <label className="label" htmlFor="avatar">
                  Ảnh đại diện
                </label>
                <div className="underline"></div>
              </div>

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                />
              )}
              <div className="input-container">
                <textarea
                  required
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label className="label" htmlFor="description">
                  Mô tả
                </label>
                <div className="underline"></div>
              </div>
            </div>

            <button type="submit" className="submit-addCompany-button">
              Thêm
            </button>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};