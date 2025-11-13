import React, { useEffect, useState } from "react";
import { FaRegEye, FaCheck, FaTimes } from "react-icons/fa";
import useJob  from "../../hook/useJob";
import Swal from "sweetalert2";
import "./Post.css";

const PostAdmin: React.FC = () => {
  const { jobs, fetchPendingJobsAdmin, approveJob, rejectJob, loading } = useJob();

  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

 const handleApprove = async (id: string) => {
  const res = await approveJob(id);
  if (res) {
    Swal.fire({
      icon: "success",
      title: "✅ Duyệt bài thành công!",
      showConfirmButton: false,
      timer: 1500,
    });
    fetchPendingJobsAdmin();
  }
};

const handleReject = async (id: string) => {
  const res = await rejectJob(id);
  if (res) {
    Swal.fire({
      icon: "error",
      title: "❌ Đã từ chối bài đăng!",
      showConfirmButton: false,
      timer: 1500,
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
                <p>{job.department?.name}</p>
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
                  onClick={() => handleApprove(job._id)}
                >
                  <FaCheck /> Duyệt
                </button>
                <button
                  className="post-btn reject"
                  onClick={() => handleReject(job._id)}
                >
                  <FaTimes /> Từ chối
                </button>
                <button className="post-btn view">
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
