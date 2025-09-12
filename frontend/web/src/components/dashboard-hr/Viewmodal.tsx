import { useState } from "react";
import "./ViewModal.css";
import type { Job } from "../../hook/useJob";
import axios from "axios";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface ViewModalProps {
  job: Job;
  onClose: () => void;
  onUpdated?: () => void;
  update: boolean;
}

const ViewModal = ({ job, onClose, onUpdated, update }: ViewModalProps) => {
  if (!job) return null;

  const [editedJob, setEditedJob] = useState<Job>({ ...job });
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);

  const handleChange = <K extends keyof Job>(
    field: K,
    value: Job[K]
  ) => {
    setEditedJob((prev: Job) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: "jobDescription" | "requirement" | "skills" | "benefits",
    index: number,
    value: string
  ) => {
    setEditedJob((prev) => {
      const current = prev[field] ?? [];
      const updated = [...current];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleSave = async () => {
    try {
      if (!editedJob?._id) {
        MySwal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không tìm thấy Job ID để cập nhật!",
        });
        return;
      }
      setLoading(true);

      const res = await axios.put(
        `${HOSTS.jobService}/${editedJob._id}`,
        editedJob
      );

      if (res.status === 200) {
        MySwal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Cập nhật job thành công.",
        });
        console.log("Updated job:", res.data);
        onUpdated?.();
        onClose();
      }
    } catch (error) {
      console.error("Update failed:", error);
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi lưu!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-modal-overlay" onDoubleClick={onClose}>
      <div className="view-modal">
        <div className="view-modal-content">
          {/* Head */}
          <div className="view-modal-head">
            <h2 className="view-modal-title" style={{ margin: 0 }}>
              {editedJob.jobTitle}
            </h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="view-modal-body">
            {/* Company Info */}
            <div className="company-info">
              <div className="flex gap-5 items-center">
                <img
                  src={editedJob.department?.avatar}
                  alt={editedJob.department?.name}
                  className="company-avatar"
                  style={{ margin: 0 }}
                />
                <div className="text-left">
                  <h3 className="font-bold">{editedJob.department?.name}</h3>
                  <p>
                    <b>Địa chỉ:</b> {editedJob.address}, {editedJob.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="creator">
                  <img
                    src={editedJob.createBy?.avatar}
                    alt={editedJob.createBy?.fullname}
                  />
                  <span>
                    Đăng bởi: <b>{editedJob.createBy?.fullname}</b>
                  </span>
                </div>
                <div className="job-date">
                  Ngày tạo: {new Date(editedJob.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="job-info">
              <div className="job-info-item">
                <span className="label job-info-lable">Loại công việc:</span>
                <input
                  className="info-input"
                  value={editedJob.jobType}
                  onChange={(e) => handleChange("jobType", e.target.value)}
                />
              </div>

              <div className="job-info-item">
                <span className="label job-info-lable">Cấp bậc:</span>
                <input
                  className="info-input"
                  value={editedJob.jobLevel}
                  onChange={(e) => handleChange("jobLevel", e.target.value)}
                />
              </div>

              <div className="job-info-item">
                <span className="label job-info-lable">Lương:</span>
                <input
                  className="info-input"
                  value={editedJob.salary}
                  onChange={(e) => handleChange("salary", e.target.value)}
                />
              </div>

              <div className="job-info-item">
                <span className="label job-info-lable">Số lượng tuyển:</span>
                <input
                  className="info-input"
                  type="number"
                  value={editedJob.num}
                  onChange={(e) =>
                    handleChange("num", parseInt(e.target.value, 10))
                  }
                />
              </div>

              <div className="job-info-item items-center">
                <span className="label job-info-lable">Hạn nộp:</span>
                <input
                  className="info-input"
                  type="date"
                  value={editedJob.endDate?.slice(0, 10)}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="section job-description">
              <h4>Mô tả công việc</h4>
              <ul className="section-ul">
                {editedJob.jobDescription?.map((desc, idx) => (
                  <li key={idx}>
                    <input
                      className="info-input"
                      type="text"
                      value={desc}
                      onChange={(e) =>
                        handleArrayChange("jobDescription", idx, e.target.value)
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="section job-description">
              <h4>Yêu cầu</h4>
              <ul className="section-ul">
                {editedJob.requirement?.map((req, idx) => (
                  <li key={idx}>
                    <input
                      className="info-input"
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleArrayChange("requirement", idx, e.target.value)
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="section job-description">
              <h4>Kỹ năng</h4>
              <ul className="skills-list section-ul">
                {editedJob.skills?.map((skill, idx) => (
                  <li key={idx}>
                    <input
                      className="info-input"
                      type="text"
                      value={skill}
                      onChange={(e) =>
                        handleArrayChange("skills", idx, e.target.value)
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            {editedJob.benefits?.length > 0 && (
              <div className="section job-description">
                <h4>Quyền lợi</h4>
                <ul className="section-ul">
                  {editedJob.benefits?.map((benefit, idx) => (
                    <li key={idx}>
                      <input
                        className="info-input"
                        type="text"
                        value={benefit}
                        onChange={(e) =>
                          handleArrayChange("benefits", idx, e.target.value)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            {update && (
              <div className="job-footer">
                <button
                  className="btn-save-edit"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu chỉnh sửa"}
                </button>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
