import React, { useEffect, useState, useMemo } from "react";
import { FaRegEye, FaCheck, FaTimes } from "react-icons/fa";
import useJob from "../../hook/useJob"; // Đảm bảo hook này export 'fetchAllJob'
import Swal from "sweetalert2";
import "./Post.css"; // File CSS ở bên dưới
import ViewModal from "../dashboard-hr/Viewmodal";
import useNotification from "../../hook/useNotification";
import useEmailService from "../../hook/useEmail";

// Định nghĩa các tab status
const STATUS_TABS = [
  { key: "pending", label: "Chờ duyệt" },
  { key: "active", label: "Đang hoạt động" },
  { key: "banned", label: "Đã từ chối" },
];

const PostAdmin: React.FC = () => {
  // Lấy đúng hàm fetchAllJob từ hook
  const { approveJob, rejectJob, fetchAllJob, banJob } = useJob();
  const { createNotification } = useNotification();
  const { sendPostApprovalNotification } = useEmailService();

  // State quản lý danh sách job, tab, search và loading
  const [jobList, setJobList] = useState<any[]>([]);
  const [activeStatus, setActiveStatus] = useState("pending"); // Tab mặc định
  const [searchQuery, setSearchQuery] = useState("");
  const [viewJob, setViewJob] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State loading riêng

  // Hàm fetch data (để gọi lại khi cần refresh)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const jobData = await fetchAllJob();
      setJobList(jobData || []); // Đảm bảo luôn là array
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobList([]);
    }
    setIsLoading(false);
  };

  // Gọi API lần đầu khi component mount
  useEffect(() => {
    fetchData();
  }, []); // Chỉ chạy 1 lần

  // Cập nhật search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleBan = async (job: any) => {
    const confirm = await Swal.fire({
      title: "Chuyển bài đăng sang trạng thái bị từ chối?",
      text: "Bài đăng sẽ bị ẩn khỏi hệ thống.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    const res = await banJob(job._id); // gọi API đổi trạng thái sang banned

    if (res) {
      Swal.fire({
        icon: "success",
        title: "Đã chuyển sang bị từ chối!",
        showConfirmButton: false,
        timer: 1500,
      });

      await createNotification({
        receiverId: job.createBy._id,
        type: "INFO",
        title: "Bài đăng của bạn đã bị từ chối",
        message: `Bài đăng "${job.jobTitle}" đã chuyển sang trạng thái bị từ chối bởi quản trị viên.`,
        requestId: job._id,
      });

      await sendPostApprovalNotification({
        hr: { fullname: job.createBy.fullname, email: job.createBy.email },
        job: { _id: job._id, title: job.jobTitle },
        status: "banned",
        reason: "Quản trị viên đã chuyển bài đăng sang trạng thái bị từ chối.",
      });

      fetchData(); // refresh danh sách
    }
  };
  // Dùng useMemo để lọc danh sách hiệu quả, chỉ tính toán lại khi dependency thay đổi
  const filtered = useMemo(() => {
    return jobList
      .filter((job) => job.status === activeStatus) // 1. Lọc theo tab
      .filter(
        (
          job // 2. Lọc theo search
        ) => job.jobTitle.toLowerCase().includes(searchQuery)
      );
  }, [jobList, activeStatus, searchQuery]);

  // Xử lý duyệt
  const handleApprove = async (job: any) => {
    const res = await approveJob(job._id);
    if (res) {
      Swal.fire({
        icon: "success",
        title: "Duyệt bài thành công!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Gửi thông báo
      await createNotification({
        receiverId: job.createBy._id,
        type: "INFO",
        title: "Bài đăng tuyển dụng đã được duyệt!",
        message: `Bài đăng tuyển dụng ${job.jobTitle} của bạn đăng đã được quản trị viên duyệt...`,
        requestId: job._id,
      });

      // Gửi email
      await sendPostApprovalNotification({
        hr: { fullname: job.createBy.fullname, email: job.createBy.email },
        job: { _id: job._id, title: job.jobTitle },
        status: "active",
        reason: "",
      });

      fetchData(); // Gọi lại API để refresh danh sách
    }
  };

  // Xử lý từ chối
  const handleReject = async (job: any) => {
    const res = await rejectJob(job._id);
    if (res) {
      Swal.fire({
        icon: "error",
        title: "Đã từ chối bài đăng!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Gửi thông báo
      await createNotification({
        receiverId: job.createBy._id,
        type: "INFO",
        title: "Bài đăng tuyển dụng đã bị từ chối",
        message: `Bài đăng tuyển dụng ${job.jobTitle} của bạn đăng đã được quản trị viên từ chối!`,
        requestId: job._id,
      });

      // Gửi email
      await sendPostApprovalNotification({
        hr: { fullname: job.createBy.fullname, email: job.createBy.email },
        job: { _id: job._id, title: job.jobTitle },
        status: "banned",
        reason:
          "Bài đăng chứa nội dung không phù hợp hoặc vi phạm quy tắc của nền tảng",
      });

      fetchData(); // Gọi lại API để refresh danh sách
    }
  };

  return (
    <div className="post-list-container">
      {/* Thanh Tabbar */}
      <div className="post-tab-bar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`post-tab-btn ${
              activeStatus === tab.key ? "active" : ""
            }`}
            onClick={() => setActiveStatus(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Thanh Search */}
      <div className="post-search-container">
        <input
          type="text"
          placeholder="Tìm kiếm bài đăng theo tiêu đề..."
          className="post-search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Modal Xem Chi tiết */}
      {viewJob && (
        <ViewModal
          job={viewJob}
          onClose={() => setViewJob(null)}
          onUpdated={() => {}}
          update={false}
          onOpenChatRequest={() => {}}
          admin={true}
          activeUser=""
        />
      )}

      {/* Hiển thị Loading hoặc Empty hoặc Grid */}
      {isLoading ? (
        <p className="post-loading">Đang tải bài đăng...</p>
      ) : filtered.length === 0 ? (
        <p className="post-empty">Không có bài đăng nào phù hợp.</p>
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
                    {job.status === "pending"
                      ? "Chờ duyệt"
                      : job.status === "active"
                      ? "Hoạt động"
                      : job.status === "banned"
                      ? "Bị từ chối"
                      : job.status}
                  </span>
                </p>
              </div>
              <div className="post-actions">
                {/* Chỉ hiện nút Duyệt/Từ chối ở tab "pending" */}
                {activeStatus === "pending" && (
                  <>
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
                  </>
                )}

                {/* Nút Xem luôn hiển thị */}
                <button
                  className="post-btn view"
                  onClick={() => setViewJob(job)}
                >
                  <FaRegEye /> Xem
                </button>
                {activeStatus === "active" && (
                  <button
                    className="post-btn reject"
                    onClick={() => handleBan(job)}
                  >
                    <FaTimes /> Từ chối
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostAdmin;
