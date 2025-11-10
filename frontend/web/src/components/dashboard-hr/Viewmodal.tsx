import { useState, useEffect } from "react";
import "./Viewmodal.css";
import type { Job } from "../../hook/useJob";
import axios from "axios";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CoverLetterCell } from "./CoverLetterCell";
import gray from "../../assets/images/gray.avif";
import useApplication, {
  type MatchingCVSResponse,
  type MatchingResponse,
} from "../../hook/useApplication";
import ModalContactCandidate from "./ModalContactCandidate";

import { AiOutlineMessage } from "react-icons/ai";
import { BsTelephone } from "react-icons/bs";
import usePayment from "../../hook/usePayment";
import { Empty } from "antd";
import { useChat } from "../../hook/useChat";
import type { ChatRoom } from "../../utils/interfaces";
import useNotification from "../../hook/useNotification";
import useEmailService from "../../hook/useEmail";
import useUser from "../../hook/useUser";

interface ViewModalProps {
  job: Job;
  onClose: () => void;
  onUpdated?: () => void;
  update: boolean;
  onOpenChatRequest: (room: ChatRoom) => void;
}

const ViewModal = ({ job, onClose, onUpdated, update, onOpenChatRequest }: ViewModalProps) => {
  if (!job) return null;
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentHRId = currentUser._id || currentUser.user_id;
  const [editedJob, setEditedJob] = useState<Job>({ ...job });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "applicants" | "candidates">("info");
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [closing, setClosing] = useState(false);
  const [matchingJobs, setMatchingJobs] = useState<MatchingResponse[]>([]);
  const [matchingCandidate, setMatchingCandidate] = useState<MatchingCVSResponse[]>([]);
  const { renderMatchingCvForJob, renderMatchingCvsForOneJob, updateStatus } = useApplication();
  const { withdraw } = usePayment();
  const [cvIdSelected, setCvIdSelected] = useState<string>("");
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);
  const MySwal = withReactContent(Swal);
  const { createChatRoom, sendChatRequest, fetchRooms, createChatRoomInactive} = useChat();
  const { createNotification } = useNotification();
  const { sendHrExchangeInvite } = useEmailService();
  const { getUser, user } = useUser();

  useEffect(() => {
    getUser(currentHRId);
  }, []);

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
      setLoadingScores(true);
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
      } finally {
        setLoadingScores(false);
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
    score: matchingJobs[index]?.finalScore
      ? Number(matchingJobs[index].finalScore)
      : null,
  }));

  const sortedApplicants = [...mergedApplicants].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0)
  );

  const appliedCvIds = new Set(applicants.map((app) => app.resumeId));

  const mergedCandidates = matchingCandidate
    .filter((cand) => !appliedCvIds.has(cand.cvId))
    .map((cand) => {
      const match = matchingCandidate.find((m) => m.cvId === cand.cvId);
      return {
        ...cand,
        score: match ? Number(match.finalScore) : null,
      };
    });

  const sortedCandidates = [...mergedCandidates].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0)
  );

  const handleChange = <K extends keyof Job>(field: K, value: Job[K]) => {
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

      if (job.status === "expired") {
        const dataToSave = { ...editedJob, status: "active" };
        const res = await axios.put(
          `${HOSTS.jobService}/${editedJob._id}`,
          dataToSave
        );

        if (res.status === 200) {
          MySwal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Gia hạn công việc thành công.",
          });
          await withdraw(1);


          onUpdated?.();
          onClose();
        }

      } else {
        const dataToSave = { ...editedJob };
        const res = await axios.put(
          `${HOSTS.jobService}/${editedJob._id}`,
          dataToSave
        );

        if (res.status === 200) {
          MySwal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Cập nhật công việc thành công.",
          });
          onUpdated?.();
          onClose();
        }
      }

    } catch (error) {
      console.error("Update/Withdraw failed:", error);
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
      // Cập nhật lại state_applicants sau khi update
      setApplicants(prev =>
        prev.map(app => app._id === id ? { ...app, status: newStatus } : app)
      );
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  const [candidateId, setCandidateId] = useState<string>("");

  const hanldeContact = (canId: any, cvId: any) => {
    setOpenModalConfirm(true);
    setCandidateId(canId);
    setCvIdSelected(cvId);
  };

  const updateStatusCV = () => {
    if (cvIdSelected) {
      handleUpdateStatus(cvIdSelected, "contacted");
    }
  };

  const handleMess = async (canId: string) => {
    try {
      const jobId = job._id;
      const members = [currentHRId, canId];

      const newRoom = await createChatRoom(jobId, members);
      if (newRoom) {
        fetchRooms();
        onOpenChatRequest(newRoom);
        handleClose();
      } else {
        console.log("❌ Không tạo được room (có thể đã tồn tại)");
        MySwal.fire({
          icon: "warning",
          title: "Thông báo",
          text: "Bạn đã trò chuyện với cho ứng viên này trước đó.",
        });
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "có lỗi xảy ra, " + error,
      });
    }
  };

  const hanldeSendRequest = async (canId: string, canFullname: string, canEmail: string) => {
    try {
      const jobId = job._id;
      const requestData = await sendChatRequest(currentHRId, canId, jobId);

      // const members = [currentHRId, canId];

      // const newRoom = await createChatRoomInactive(jobId, members);
      // if (newRoom) {
      //   fetchRooms();
      //   // onOpenChatRequest(newRoom);
      // } else {
      //   console.log("❌ Không tạo được room (có thể đã tồn tại)");
      //   MySwal.fire({
      //     icon: "warning",
      //     title: "Thông báo",
      //     text: "Bạn đã trò chuyện với cho ứng viên này trước đó.",
      //   });
      // }

      if (requestData) {
        MySwal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã gửi yêu cầu trao đổi với ứng viên, để có thể bắt đầu trao đổi phải đợi họ chấp nhận yêu cầu!",
        });

        const emailMessage = `Xin chào! Chúng tôi nhận thấy bạn phù hợp với công việc ${job.jobTitle} tại công ty ${job.department.name} của chúng tôi, nếu bạn có nhu cầu ứng tuyển hãy chấp nhận lời mời của chúng tôi để trao đổi kỹ hơn, hoặc bạn có thể ứng tuyển. Vui lòng kiểm tra email để biết thêm chi tiết.`;

        await createNotification({
          receiverId: canId,
          type: "CHAT_REQUEST",
          title: "Lời mời trao đổi và ứng tuyển công việc",
          message: emailMessage,
          requestId: requestData._id
        });

        await sendHrExchangeInvite({
          candidate: {
            fullname: canFullname,
            email: canEmail,
          },
          hr: {
            fullname: user?.fullname ?? "",
            email: user?.email ?? "",
            companyName: job.department.name,
          },
          job: {
            title: job.jobTitle,
            _id: job._id
          },
          message: emailMessage,
        });

        handleClose();
      } else {
        console.log("❌ Không tạo được room (có thể đã tồn tại)");

        MySwal.fire({
          icon: "info",
          title: "Thông báo",
          text: "Bạn đã gửi yêu cầu cho ứng viên này trước đó.",
        });
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi gửi yêu cầu! " + error
      });
    }
  };

  const handleCloseConfirm = () => {
    setOpenModalConfirm(false);
  };

  const statusMap = {
    pending: "Đang chờ duyệt",
    reviewed: "Đã xem xét",
    accepted: "Đã chấp nhận",
    rejected: "Đã từ chối",
    contacted: "Đã liên hệ",
  };

  const isReadOnly = job.status !== "active";
  const isEndDateDisabled = job.status !== "active" && job.status !== "expired";
  const showSaveButton = update && (job.status === "active" || job.status === "expired");

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
              disabled={isReadOnly} // Logic mới
            />

            <button className="close-btn" onClick={handleClose}>
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="tab-header flex gap-4" style={{ padding: 5 }}>
            <button
              className={`tab-btn-hr ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Thông tin công việc
            </button>
            <button
              className={`tab-btn-hr ${activeTab === "applicants" ? "active" : ""
                }`}
              onClick={() => setActiveTab("applicants")}
            >
              Ứng viên ứng tuyển
            </button>
            <button
              className={`tab-btn-hr ${activeTab === "candidates" ? "active" : ""
                }`}
              onClick={() => setActiveTab("candidates")}
            >
              Ứng viên phù hợp
            </button>
          </div>

          {/* Tab content */}
          <div className="view-modal-body h-full">
            {openModalConfirm && (
              <ModalContactCandidate
                job={job}
                candidate_id={candidateId}
                close={handleCloseConfirm}
                updateStatus={updateStatusCV}
              />
            )}

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
                      disabled={isReadOnly} // Logic mới
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
                      disabled={isReadOnly} // Logic mới
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
                    <span className="label job-info-lable">Kinh nghiệm:</span> {/* Sửa label "Cấp bậc" -> "Kinh nghiệm" */}
                    <select
                      className="info-input"
                      value={editedJob.experience}
                      onChange={(e) =>
                        handleChange("experience", e.target.value)
                      }
                      disabled={isReadOnly} // Logic mới
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
                      disabled={isReadOnly} // Logic mới
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
                      disabled={isReadOnly} // Logic mới
                    />
                  </div>

                  <div className="job-info-item">
                    <span className="label job-info-lable">Thời gian làm việc:</span>
                    <input
                      className="info-input"
                      value={editedJob.workingHours}
                      onChange={(e) =>
                        handleChange("workingHours", e.target.value)
                      }
                      disabled={isReadOnly} // Logic mới
                    />
                  </div>

                  <div className="job-info-item items-center">
                    <span className="label job-info-lable">Hạn nộp:</span>
                    <input
                      className="info-input"
                      type="date"
                      value={editedJob.endDate?.slice(0, 10)}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      disabled={isEndDateDisabled} // Logic MỚI: Chỉ disable khi không active VÀ không expired
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
                            handleArrayChange(
                              "jobDescription",
                              idx,
                              e.target.value
                            )
                          }
                          disabled={isReadOnly} // Logic mới
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
                            handleArrayChange(
                              "requirement",
                              idx,
                              e.target.value
                            )
                          }
                          disabled={isReadOnly} // Logic mới
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
                          disabled={isReadOnly} // Logic mới
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
                            disabled={isReadOnly} // Logic mới
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {showSaveButton && (
                  <div className="job-footer">
                    <button
                      className="btn-save-edit"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading
                        ? "Đang lưu..."
                        : (job.status === 'expired' ? 'Gia hạn và mở lại' : 'Lưu chỉnh sửa')}
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
                  <div>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có ai ứng tuyển cho công việc này!" />
                  </div>
                ) : (
                  <div className="inline-block min-w-full align-middle">
                    <div className="table-wrapper">
                      <p className="text-left font-bold" style={{ paddingBottom: 10 }}>
                        Tổng số ứng viên: {applicants.length}
                      </p>
                      <table className="applications-table">
                        <thead>
                          <tr>
                            <th>Ứng viên</th>
                            <th>Thư giới thiệu</th>
                            <th>Trạng thái</th>
                            <th>Độ phù hợp</th>
                            <th>CV</th>
                            <th>Trao đổi</th>
                            <th>Liên hệ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedApplicants.map((app) => (
                            <tr key={app._id}>
                              <td className="flex gap-1.5 items-center w-fit">
                                <img
                                  src={app.userSnapshot.avatar || gray}
                                  className="candidate-avt"
                                  alt=""
                                />{" "}
                                {app.userSnapshot.fullname}
                              </td>

                              <CoverLetterCell coverLetter={app.coverLetter} />

                              <td>
                                <span
                                  className={`status-badge status-${app.status}`}
                                >
                                  {statusMap[
                                    app.status as keyof typeof statusMap
                                  ] || app.status}
                                </span>
                              </td>

                              <td className="font-bold text-emerald-500">
                                {loadingScores ? (
                                  <div className="small-loader"></div>
                                ) : app.score !== null ? (
                                  `${app.score.toFixed(2)}%`
                                ) : (
                                  "-"
                                )}
                              </td>

                              <td>
                                {app.cvSnapshot?.fileUrls ? (
                                  <a
                                    href={app.cvSnapshot.fileUrls}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 font-bold"
                                    onClick={() => {
                                      if (app.status === 'pending') {
                                        handleUpdateStatus(app._id, "reviewed");
                                      }
                                    }}
                                  >
                                    Xem
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </td>

                              <td>
                                <button
                                  className="btn-mess"
                                  onClick={() => { handleMess(app.userSnapshot._id) }}>
                                  <AiOutlineMessage size={18} />
                                </button>
                              </td>

                              <td>
                                <button
                                  className="btn-contact"
                                  onClick={() => {
                                    hanldeContact(app.userId, app._id);
                                  }}
                                >
                                  <BsTelephone size={18} />
                                </button>
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
                  <div className="loading-container">
                    <div className="loader"></div>
                    <p>Đang tải ...</p>
                  </div>
                ) : sortedCandidates.length === 0 ? (
                  <div className="loading-container">
                    {/* <div className="loader"></div> */}
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có ứng viên phù hợp!" />
                    {/* <p>Đang tải ...</p> */}
                  </div>
                ) : (
                  <table
                    className="applications-table"
                    style={{ marginTop: 20 }}
                  >
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Ứng viên</th>
                        <th className="px-4 py-2">Điểm phù hợp</th>
                        <th className="px-4 py-2">CV</th>
                        <th className="px-4 py-2">Liên hệ trao đổi</th>
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
                            {app.score !== null
                              ? `${app.score.toFixed(2)}%`
                              : "-"}
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
                            <button
                              className="btn-mess"
                              onClick={() => {
                                hanldeSendRequest(app.userId, app.user?.fullname ?? "", app.user?.email ?? "");
                              }}
                            >
                              <AiOutlineMessage size={18} />
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