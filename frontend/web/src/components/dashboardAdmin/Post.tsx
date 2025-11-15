import React, { useEffect, useState } from "react";
import { FaRegEye, FaCheck, FaTimes } from "react-icons/fa";
import useJob from "../../hook/useJob";
import Swal from "sweetalert2";
import "./Post.css";
import ViewModal from "../dashboard-hr/Viewmodal";
import useNotification from "../../hook/useNotification";
import useEmailService from "../../hook/useEmail";

const PostAdmin: React.FC = () => {
  const { jobs, fetchPendingJobsAdmin, approveJob, rejectJob, loading } = useJob();
  const { createNotification } = useNotification();
  const { sendPostApprovalNotification } = useEmailService();

  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewJob, setViewJob] = useState<any | null>(null);

  useEffect(() => {
    fetchPendingJobsAdmin();
  }, [fetchPendingJobsAdmin]);


  useEffect(() => {
    setPendingJobs(jobs.filter((j) => j.status === "pending"));
  }, [jobs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filtered = pendingJobs.filter((job) =>
    job.jobTitle.toLowerCase().includes(searchQuery)
  );

  const handleApprove = async (job: any) => {
    const res = await approveJob(job._id);
    if (res) {
      Swal.fire({
        icon: "success",
        title: "Duyệt bài thành công!",
        showConfirmButton: false,
        timer: 1500,
      });

      await createNotification({
        receiverId: job.createBy._id,
        type: "INFO",
        title: "Bài đăng tuyển dụng đã được duyệt!",
        message: `Bài đăng tuyển dụng ${job.jobTitle} của bạn đăng đã được quản trị viên duyệt, bây giờ các ứng viên có thể thấy bài đăng và ứng tuyển!`,
        requestId: job._id
      });

      await sendPostApprovalNotification({
        hr: {
          fullname: job.createBy.fullname,
          email: job.createBy.email,
        },
        job: {
          _id: job._id,
          title: job.jobTitle,
        },
        status: "active",
        reason: ""
      });

      fetchPendingJobsAdmin();
    }
  };

  const handleReject = async (job: any) => {
    const res = await rejectJob(job._id);
    if (res) {
      Swal.fire({
        icon: "error",
        title: "Đã từ chối bài đăng!",
        showConfirmButton: false,
        timer: 1500,
      });

      await createNotification({
        receiverId: job.createBy._id,
        type: "INFO",
        title: "Bài đăng tuyển dụng đã bị từ chối",
        message: `Bài đăng tuyển dụng ${job.jobTitle} của bạn đăng đã được quản trị viên từ chối!`,
        requestId: job._id
      });

      await sendPostApprovalNotification({
        hr: {
          fullname: job.createBy.fullname,
          email: job.createBy.email,
        },
        job: {
          _id: job._id,
          title: job.jobTitle,
        },
        status: "banned",
        reason: "Bài đăng chứa nội dung không phù hợp hoặc vi phạm quy tắc của nền tảng"
      });

      fetchPendingJobsAdmin();
    }
  };


  return (
    <div className="post-list-container">
      <div className="post-search-container">
        <input
          type="text"
          placeholder="Tìm kiếm bài đăng theo tiêu đề..."
          className="post-search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {viewJob && (
        <ViewModal
          job={viewJob}
          onClose={() => setViewJob(null)}
          onUpdated={() => { }}
          update={false}
          onOpenChatRequest={() => { }}
        />
      )}

      {loading ? (
        <p className="post-loading">Đang tải bài đăng...</p>
      ) : filtered.length === 0 ? (
        <p className="post-empty">Không có bài đăng nào cần duyệt.</p>
      ) : (
        <div className="post-grid">
          {filtered.map((job) => (
            <div className="post-card" key={job._id}>
              <div className="post-info">
                <h3>{job.jobTitle}</h3>
                <p className="font-bold">{job.department?.name}</p>
                <p>
                  Trạng thái:{" "}
                  <span className={`post-status ${job.status}`}>
                    {job.status === "pending" ? "Đang chờ duyệt" : job.status}
                  </span>
                </p>
              </div>
              <div className="post-actions">
                <button
                  className="post-btn approve"
                  onClick={() => handleApprove(job)}
                >
                  <FaCheck /> Duyệt
                </button>
                <button
                  className="post-btn reject"
                  onClick={() => handleReject(job)}
                >
                  <FaTimes /> Từ chối
                </button>
                <button className="post-btn view" onClick={() => setViewJob(job)}>
                  <FaRegEye /> Xem
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostAdmin;
