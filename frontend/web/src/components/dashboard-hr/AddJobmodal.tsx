import React, { useState } from "react";
import "./AddJobModal.css";
import { AiOutlineClose } from "react-icons/ai";
import { HOSTS } from "../../utils/host";

interface AddJobModalProps {
  onClose: () => void;
  onSave: (data: {
    jobTitle: string;
    jobType: string;
    skills: string[];
    salary: string;
    address: string;
    date: string;
  }) => void;
}

const AddJobModal: React.FC<AddJobModalProps> = ({ onClose, onSave }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [skills, setSkills] = useState([""]);
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [jobDescription, setjobDescription] = useState("");

  const handleAddSkill = () => {
    setSkills([...skills, ""]);
  };
  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };
  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !jobTitle.trim() ||
      !jobType.trim() ||
      !salary.trim() ||
      !address.trim() ||
      !jobDescription.trim() || 
      skills.some((skill) => !skill.trim())
    ) {
      alert("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }

    try {
      const response = await fetch(`${HOSTS.jobService}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          jobType,
          skills: skills.filter((skill) => skill.trim()),
          salary,
          address,
          jobDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to save job");
      const savedJob = await response.json();
      onSave({
        ...savedJob,
        date: new Date(savedJob.createdAt).toLocaleDateString(),
      });
      onClose();
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>THÊM CÔNG VIỆC</h2>
        <button className="close-button" onClick={onClose}>
          <AiOutlineClose />
        </button>
        <form onSubmit={handleSubmit}>
          <div className="section-container">
            <h3>Thông tin chung</h3>
            <div className="input-container">
              <input
                required
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <label className="label" htmlFor="job-title">
                Tên công việc
              </label>
              <div className="underline"></div>
            </div>
            <div className="input-container">
              <input
                required
                id="job-type"
                type="text"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              />
              <label className="label" htmlFor="job-type">
                Hình thức làm việc
              </label>
              <div className="underline"></div>
            </div>
          </div>
          <div className="section-container">
            <h3>Giới thiệu công ty</h3>
    <div className="input-container">
      <textarea
        required
        id="job-description"
        value={jobDescription}
        onChange={(e) => setjobDescription(e.target.value)}
      />
      <label className="label" htmlFor="job-description">
        Giới thiệu công ty
      </label>
      <div className="underline"></div>
    </div>
            <h3>Kỹ Năng</h3>
            {skills.map((skill, index) => (
              <div className="skill-input-wrapper" key={index}>
                <div className="input-container">
                  <input
                    required
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                  />
                  <label className="label">{`Kĩ năng ${index + 1}`}</label>
                  <div className="underline"></div>
                </div>
                {skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="remove-skill-button"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <div className="add-button-container">
              <button type="button" onClick={handleAddSkill}>
                Thêm kĩ năng
              </button>
            </div>
          </div>
          <div className="section-container dual-fields">
            <h3>Thông tin bổ sung</h3>
            <div className="input-row">
              <div className="input-container half-width">
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
              <div className="input-container half-width">
                <input
                  required
                  id="salary"
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
                <label className="label" htmlFor="salary">
                  Mức lương
                </label>
                <div className="underline"></div>
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
