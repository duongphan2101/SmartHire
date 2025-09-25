import { useState, useEffect } from "react";
import "./Viewmodal.css";
import type { Job } from "../../hook/useJob";
import axios from "axios";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CoverLetterCell } from "./CoverLetterCell";
import gray from "../../assets/images/gray.avif";
import useApplication, { type MatchingCVSResponse, type MatchingResponse } from "../../hook/useApplication";

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
  const [activeTab, setActiveTab] = useState<"info" | "applicants" | "candidates">("info");
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [closing, setClosing] = useState(false);
  const [matchingJobs, setMatchingJobs] = useState<MatchingResponse[]>([]);
  const [matchingCandidate, setMatchingCandidate] = useState<MatchingCVSResponse[]>([]);
  const { renderMatchingCvForJob, renderMatchingCvsForOneJob, updateStatus } = useApplication();

  const MySwal = withReactContent(Swal);

  // fetch ứng viên khi chuyển tab
  useEffect(() => {
    const fetchApplicants = async () => {
      if (activeTab !== "applicants") return;
      setLoadingApplicants(true);
      try {
        const res = await axios.get(
          `${HOSTS.applicationService}/job/${job._id}`
        );
        setApplicants(res.data.data ?? []);
      } catch (err) {
        console.error("Lỗi load ứng viên:", err);
        MySwal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải danh sách ứng viên!",
        });
      } finally {
        setLoadingApplicants(false);
      }
    };
    fetchApplicants();
  }, [activeTab, job._id]);

  useEffect(() => {
    const fetchMatchingOne = async () => {
      try {
        const results: MatchingResponse[] = await Promise.all(
          applicants.map(async (applicant) => {
            const data = {
              job_id: job._id,
              cv_id: applicant.resumeId,
            };
            const res = await renderMatchingCvForJob(data);
            return { ...res, cvId: applicant.resumeId };
          })
        );
        setMatchingJobs(results);
      } catch (err) {
        console.error("❌ MatchingOne error:", err);
      }
    };

    const fetchMatchingCvsForOneJob = async () => {
      try {
        const data = { job_id: job._id };
        const res = await renderMatchingCvsForOneJob(data); // res là list
        setMatchingCandidate(res);
      } catch (err) {
        console.error("❌ MatchingCvsForOneJob error:", err);
      }
    };

    if (job?._id) {
      if (applicants.length > 0) {
        fetchMatchingOne();
      } else {
        fetchMatchingCvsForOneJob();
      }
    }
  }, [applicants, job?._id, renderMatchingCvForJob, renderMatchingCvsForOneJob]);

  const mergedApplicants = applicants.map((app, index) => ({
    ...app,
    score: matchingJobs[index]?.score ? Number(matchingJobs[index].score) : null,
  }));

  const sortedApplicants = [...mergedApplicants].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const appliedCvIds = new Set(applicants.map((app) => app.resumeId));

  const mergedCandidates = matchingCandidate
    .filter((cand) => !appliedCvIds.has(cand.cvId))
    .map((cand) => {
      const match = matchingCandidate.find((m) => m.cvId === cand.cvId);
      return {
        ...cand,
        score: match ? Number(match.score) : null,
      };
    });

  const sortedCandidates = [...mergedCandidates].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0)
  );

  const handleChange = <K extends keyof Job>(
    field: K,
    value: Job[K]
  ) => {
    setEditedJob((prev: Job) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await updateStatus({ id, status: newStatus });
      console.log("✅ Updated:", res.data);
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  const hanldeContact = () => {
    MySwal.fire({
      icon: "info",
      title: "Chức năng đang phát triển",
      text: "Chức năng liên hệ đang được phát triển. Vui lòng thử lại sau.",
    });
  }


  return (
    <div className="view-modal-overlay" onDoubleClick={handleClose}>
      <div className={`view-modal ${closing ? "close" : ""}`}>
        <div className="view-modal-content">
          {/* Head */}
          <div className="view-modal-head">

            <input
              className="info-input view-modal-title"
              value={editedJob.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
            />

            <button className="close-btn" onClick={handleClose}>
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="tab-header flex gap-4" style={{ padding: 5 }}>
            <button
              className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Thông tin Job
            </button>
            <button
              className={`tab-btn ${activeTab === "applicants" ? "active" : ""}`}
              onClick={() => setActiveTab("applicants")}
            >
              Ứng viên ứng tuyển
            </button>
            <button
              className={`tab-btn ${activeTab === "candidates" ? "active" : ""}`}
              onClick={() => setActiveTab("candidates")}
            >
              Ứng viên phù hợp
            </button>
          </div>

          {/* Tab content */}
          <div className="view-modal-body h-full">

            {activeTab === "info" && (
              <div className="tab-content tab-content-enter">
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
                    <select
                      className="info-input"
                      value={editedJob.jobType}
                      onChange={(e) => handleChange("jobType", e.target.value)}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Intern">Intern</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div className="job-info-item">
                    <span className="label job-info-lable">Cấp bậc:</span>
                    <select
                      className="info-input"
                      value={editedJob.jobLevel}
                      onChange={(e) => handleChange("jobLevel", e.target.value)}
                    >
                      <option value="Intern">Intern</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>

                  <div className="job-info-item">
                    <span className="label job-info-lable">Cấp bậc:</span>
                    <select
                      className="info-input"
                      value={editedJob.experience}
                      onChange={(e) => handleChange("experience", e.target.value)}
                    >
                      <option value="none">Không yêu cầu</option>
                      <option value="lt1">Dưới 1 năm</option>
                      <option value="1-3">1 - 3 năm</option>
                      <option value="3-5">3 - 5 năm</option>
                      <option value="5-7">5 - 7 năm</option>
                      <option value="7-10">7 - 10 năm</option>
                      <option value="gt10">Trên 10 năm</option>
                    </select>
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

                  <div className="job-info-item">
                    <span className="label job-info-lable">Thời gian làm việc:</span>
                    <input
                      className="info-input"
                      value={editedJob.workingHours}
                      onChange={(e) => handleChange("workingHours", e.target.value)}
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
            )}

            {activeTab === "applicants" && (
              <div className="tab-content tab-content-enter overflow-x-auto">
                {loadingApplicants ? (
                  <p>Đang tải ứng viên...</p>
                ) : applicants.length === 0 ? (
                  <p>Chưa có ai ứng tuyển</p>
                ) : (
                  <div className="inline-block min-w-full align-middle">

                    <div className="table-wrapper">
                      <p className="text-left font-bold" style={{ paddingBottom: 10 }}>Tổng số ứng viên: {applicants.length}</p>
                      <table className="applications-table">
                        <thead>
                          <tr>
                            <th>Ứng viên</th>
                            <th>Thư giới thiệu</th>
                            <th>Trạng thái</th>
                            <th>Độ phù hợp</th>
                            <th>CV</th>
                            <th>Liên hệ</th>
                          </tr>
                        </thead>
                        <tbody>

                          {sortedApplicants.map((app) => (
                            <tr key={app._id}>
                              <td className="flex gap-1.5 items-center w-fit">
                                <img src={app.userSnapshot.avatar || gray} className="candidate-avt" alt="" />{" "}
                                {app.userSnapshot.fullname}
                              </td>

                              <CoverLetterCell coverLetter={app.coverLetter} />

                              <td>
                                <span className={`status-badge status-${app.status}`}>
                                  {app.status}
                                </span>
                              </td>

                              <td className="font-bold text-emerald-500">
                                {app.score !== null ? `${app.score.toFixed(2)}%` : "-"}
                              </td>

                              <td>
                                {app.cvSnapshot?.fileUrls ? (
                                  <a
                                    href={app.cvSnapshot.fileUrls}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 font-bold"
                                    onClick={() => { handleUpdateStatus(app._id, "reviewed") }}
                                  >
                                    Xem
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </td>

                              <td>
                                <button className="btn-contact" onClick={hanldeContact}>Liên hệ</button>
                              </td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>

                  </div>
                )}
              </div>
            )}

            {activeTab === "candidates" && (
              <div className="tab-content tab-content-enter">
                {loadingApplicants ? (
                  <p>Đang tải ứng viên...</p>
                ) : sortedCandidates.length === 0 ? (
                  <p>Chưa có ứng viên phù hợp</p>
                ) : (
                  <table className="applications-table" style={{ marginTop: 20 }}>
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Ứng viên</th>
                        <th className="px-4 py-2">Điểm phù hợp</th>
                        <th className="px-4 py-2">CV</th>
                        <th className="px-4 py-2">Liên hệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCandidates.map((app) => (
                        <tr key={app.userId}>
                          <td className="flex items-center gap-2">
                            <img
                              src={app.user?.avatar || gray}
                              alt=""
                              className="candidate-avt"
                            />
                            {app.user?.fullname}
                          </td>
                          <td className="font-bold text-emerald-500">
                            {app.score !== null ? `${app.score.toFixed(2)}%` : "-"}
                          </td>
                          <td>
                            {app.user?.cv[0].fileUrls ? (
                              <a
                                href={app.user?.cv[0].fileUrls}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 font-bold"
                              >
                                Xem
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            <button className="btn-contact" onClick={hanldeContact}>
                              Liên hệ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
