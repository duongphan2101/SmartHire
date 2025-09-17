import React, { useState } from 'react';
import "./AddDerpartmentmodal.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddDerpartmentmodalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    address: string;
    description: string;
    website: string;
    avatar: string;
    employees: string[];
  }) => void;
}


export const AddDepartmentmodal: React.FC<AddDerpartmentmodalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar, setAvatar] = useState("");
  const [employees, setEmployees] = useState([""]);

  // Employees
  const handleAddEmployee = () => setEmployees([...employees, ""]);
  const handleRemoveEmployee = (index: number) => {
    const newEmployees = [...employees];
    newEmployees.splice(index, 1);
    setEmployees(newEmployees);
  };
  const handleEmployeeChange = (index: number, value: string) => {
    const newEmployees = [...employees];
    newEmployees[index] = value;
    setEmployees(newEmployees);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !address.trim() ||
      !description.trim() ||
      !website.trim() ||
      !avatar.trim() ||
      employees.some((emp) => !emp.trim())
    ) {
      toast.error("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }

    const payload = {
      name,
      address,
      description,
      website,
      avatar,
      employees: employees.filter((emp) => emp.trim()),
    };

    onSave(payload);
    toast.success("Tạo phòng ban thành công");
    onClose();
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
              <h3>Thông tin chung</h3>
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
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
                <label className="label" htmlFor="avatar">
                  URL ảnh đại diện
                </label>
                <div className="underline"></div>
              </div>
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

            {/* Nhân viên */}
            <div className="section-container">
              <h3>Nhân viên</h3>
              {employees.map((employee, index) => (
                <div className="skill-input-wrapper" key={index}>
                  <div className="input-container">
                    <input
                      required
                      type="text"
                      value={employee}
                      onChange={(e) => handleEmployeeChange(index, e.target.value)}
                    />
                    <label className="label">{`Nhân viên`}</label>
                    <div className="underline"></div>
                  </div>
                  {/* {employees.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEmployee(index)}
                      className="remove-skill-button"
                    >
                      Xóa
                    </button>
                  )} */}
                </div>
              ))}
              {/* <div className="add-button-container">
                <button type="button" onClick={handleAddEmployee}>
                  Thêm nhân viên
                </button>
              </div> */}
            </div>

            <button type="submit" className="submit-button">
              Thêm
            </button>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};