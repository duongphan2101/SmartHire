import React, { useState, useEffect } from "react";
import "./AddJobModal.css";
import { HOSTS } from "../../utils/host";
import { fetchProvinces, type Province } from "../../utils/provinceApi";
import useDepartment from "../../hook/useDepartment";
import useUser from "../../hook/useUser";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddJobModalProps {
  onClose: () => void;
  onSave: (data: {
    jobTitle: string;
    jobType: string;
    jobLevel: string;

    department: {
      id: string;
      name: string;
      avatar?: string;
    };

    createBy: {
      id: string;
      fullname: string;
      avatar?: string;
    };

    requirement: string[];
    skills: string[];
    benefits: string[];
    salary: string;
    location: string;
    address: string;
    jobDescription: string[];
    date: string;
    endDate: string;
    num: number;
  }) => void;
}

const AddJobModal: React.FC<AddJobModalProps> = ({ onClose, onSave }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [requirements, setRequirements] = useState([""]);
  const [skills, setSkills] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [jobDescriptions, setJobDescriptions] = useState([""]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [location, setLocation] = useState("");
  const [endDate, setEndDate] = useState("");
  const [num, setNum] = useState<number | "">("");
  const { department } = useDepartment();
  const { getUser, user } = useUser();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const idToFetch = parsed.user_id ?? parsed._id;
        getUser(idToFetch);
      }
    } catch (e) {
      console.error("Invalid user data in localStorage", e);
    }

    fetchProvinces().then(setProvinces);
  }, [getUser]);

  // Thêm / xóa / sửa mô tả
  const handleAddDescription = () => setJobDescriptions([...jobDescriptions, ""]);
  const handleRemoveDescription = (index: number) => {
    const newDescs = [...jobDescriptions];
    newDescs.splice(index, 1);
    setJobDescriptions(newDescs);
  };
  const handleDescriptionChange = (index: number, value: string) => {
    const newDescs = [...jobDescriptions];
    newDescs[index] = value;
    setJobDescriptions(newDescs);
  };


  // Skills
  const handleAddSkill = () => setSkills([...skills, ""]);
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

  // Requirements
  const handleAddRequirement = () => setRequirements([...requirements, ""]);
  const handleRemoveRequirement = (index: number) => {
    const newRequirements = [...requirements];
    newRequirements.splice(index, 1);
    setRequirements(newRequirements);
  };
  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  // Benefits
  const handleAddBenefit = () => setBenefits([...benefits, ""]);
  const handleRemoveBenefit = (index: number) => {
    const newBenefits = [...benefits];
    newBenefits.splice(index, 1);
    setBenefits(newBenefits);
  };
  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !jobTitle.trim() ||
      !jobType.trim() ||
      !jobLevel.trim() ||
      !salary.trim() ||
      !address.trim() ||
      !location.trim() ||
      !department ||
      !endDate ||
      !num ||
      jobDescriptions.some((s) => !s.trim()) ||
      skills.some((s) => !s.trim()) ||
      requirements.some((r) => !r.trim()) ||
      benefits.some((b) => !b.trim())
    ) {
      alert("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }
    const payload = {
      jobTitle,
      jobType,
      jobLevel,
      department: {
        _id: department._id,
        name: department.name,
        avatar: department.avatar || "",
      },
      createBy: {
        _id: user?.user_id || user?._id,
        fullname: user?.fullname,
        avatar: user?.avatar
      },
      skills: skills.filter((s) => s.trim()),
      requirement: requirements.filter((s) => s.trim()),
      benefits: benefits.filter((s) => s.trim()),
      salary,
      address,
      location,
      jobDescription: jobDescriptions.filter((d) => d.trim()),
      endDate,
      num,
    };

    try {
      const response = await fetch(`${HOSTS.jobService}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save job");
      const savedJob = await response.json();

      onSave({
        ...savedJob,
        date: new Date(savedJob.createdAt).toLocaleDateString(),
      });
      toast.success("Tạo bài đăng thành công");
      onClose();
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };


  return (
    <div className="modal" onDoubleClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <p className="font-bold text-2xl">Thêm bài đăng</p>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>

            {/* Thông tin chung */}
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

              <div className="input-row">
                <div className="input-container half-width">
                  <select
                    required
                    id="job-type"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    <option value="">Hình thức làm việc</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Remote">Remote</option>
                  </select>
                  <div className="underline"></div>
                </div>

                <div className="input-container half-width">
                  <select
                    required
                    id="job-level"
                    value={jobLevel}
                    onChange={(e) => setJobLevel(e.target.value)}
                  >
                    <option value="">Vị trí</option>
                    <option value="Internship">Internship</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                  </select>
                  <div className="underline"></div>
                </div>
              </div>

              {/* Thêm hàng input cho endDate và num */}
              <div className="input-row">
                <div className="input-container half-width">
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                  <label className="label" htmlFor="end-date">
                    Ngày kết thúc
                  </label>
                  <div className="underline"></div>
                </div>

                <div className="input-container half-width">
                  <input
                    type="number"
                    id="num"
                    value={num}
                    onChange={(e) => setNum(Number(e.target.value))}
                    min={1}
                    required
                  />
                  <label className="label" htmlFor="num">
                    Số lượng tuyển
                  </label>
                  <div className="underline"></div>
                </div>
              </div>

            </div>

            {/* Mô tả công việc */}
            <div className="section-container">
              <h3>Mô tả công việc</h3>
              {jobDescriptions.map((desc, index) => (
                <div className="skill-input-wrapper" key={index}>
                  <div className="input-container">
                    <input
                      required
                      type="text"
                      value={desc}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    />
                    <label className="label">{`Mô tả ${index + 1}`}</label>
                    <div className="underline"></div>
                  </div>
                  {jobDescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDescription(index)}
                      className="remove-skill-button"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
              <div className="add-button-container">
                <button type="button" onClick={handleAddDescription}>
                  Thêm mô tả
                </button>
              </div>
            </div>


            {/* Yêu cầu */}
            <div className="section-container">
              <h3>Yêu cầu ứng viên</h3>
              {requirements.map((requirement, index) => (
                <div className="skill-input-wrapper" key={index}>
                  <div className="input-container">
                    <input
                      required
                      type="text"
                      value={requirement}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                    />
                    <label className="label">{`Yêu cầu ${index + 1}`}</label>
                    <div className="underline"></div>
                  </div>
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="remove-skill-button"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
              <div className="add-button-container">
                <button type="button" onClick={handleAddRequirement}>
                  Thêm yêu cầu
                </button>
              </div>
            </div>

            {/* Kỹ năng */}
            <div className="section-container">
              <h3>Kỹ năng yêu cầu</h3>
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

            {/* Phúc lợi */}
            <div className="section-container">
              <h3>Phúc lợi</h3>
              {benefits.map((benefit, index) => (
                <div className="skill-input-wrapper" key={index}>
                  <div className="input-container">
                    <input
                      required
                      type="text"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                    />
                    <label className="label">{`Phúc lợi ${index + 1}`}</label>
                    <div className="underline"></div>
                  </div>
                  {benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(index)}
                      className="remove-skill-button"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
              <div className="add-button-container">
                <button type="button" onClick={handleAddBenefit}>
                  Thêm phúc lợi
                </button>
              </div>
            </div>

            {/* Thông tin bổ sung */}
            <div className="section-container dual-fields">
              <h3>Thông tin bổ sung</h3>
              <div className="input-row">
                {/* Combobox Địa điểm */}
                <div className="input-container half-width">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full xl:w-2/6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Chọn địa điểm</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-container half-width">
                  <input
                    required
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <label className="label" htmlFor="address">
                    Địa chỉ cụ thể
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
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default AddJobModal;
