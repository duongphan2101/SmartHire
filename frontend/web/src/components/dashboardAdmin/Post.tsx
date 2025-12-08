import React, { useEffect, useState, useMemo } from "react";
import { FaRegEye, FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { Spin, Empty } from "antd";

// Import Hooks
import useJob from "../../hook/useJob";
import useNotification from "../../hook/useNotification";
import useEmailService from "../../hook/useEmail";

// Import Components & CSS
import ViewModal from "../dashboard-hr/Viewmodal";
import "./Post.css";

// --- CẤU HÌNH TABS ---
const STATUS_TABS = [
  { key: "pending", label: "Chờ duyệt" },
  { key: "active", label: "Đang hoạt động" },
  { key: "banned", label: "Đã từ chối/Khóa" },
  { key: "exandfill", label: "Đã tuyển đủ/Hết hạn" }, // Tab mới
];

// --- INTERFACE PROPS ---
interface PostAdminProps {
  idPostActive?: string;
  status?: string;
}

const PostAdmin: React.FC<PostAdminProps> = ({ idPostActive, status }) => {
  // --- HOOKS ---
  const {
    approveJob,
    rejectJob,
    fetchAllJob,
    banJob,
    exandfillJobsAdmin, // Data từ hook cho tab mới
    fetchExperiedAndFilledJobsAdmin // Hàm fetch cho tab mới
  } = useJob();

  const { createNotification } = useNotification();
  const { sendPostApprovalNotification } = useEmailService();

  // --- STATE ---
  const [jobList, setJobList] = useState<any[]>([]); // Chứa Active/Pending/Banned
  const [activeStatus, setActiveStatus] = useState(status || "pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewJob, setViewJob] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- EFFECT 1: SYNC STATUS TỪ DASHBOARD ---
  useEffect(() => {
    if (status) {
      setActiveStatus(status);
    }
  }, [status]);

  // --- EFFECT 2: FETCH DATA ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Gọi song song 2 API: Lấy list thường và list hết hạn/full
      const [normalJobs] = await Promise.all([
        fetchAllJob(),
        fetchExperiedAndFilledJobsAdmin()
      ]);

      setJobList(normalJobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // 1. Approve
  const handleApprove = async (job: any) => {
    const res = await approveJob(job._id);
    if (res) {
      Swal.fire({ icon: "success", title: "Duyệt thành công", showConfirmButton: false, timer: 1500 });

      await createNotification({
        receiverId: job.createBy._id,
        type: "INFO",
        title: "Bài đăng được duyệt",
        message: `Bài "${job.jobTitle}" đã được duyệt.`,
        requestId: job._id,
      });

      await sendPostApprovalNotification({
        hr: { fullname: job.createBy.fullname, email: job.createBy.email },
        job: { _id: job._id, title: job.jobTitle },
        status: "active",
        reason: "",
      });

      fetchData();
    }
  };

  // 2. Reject
  const handleReject = async (job: any) => {
    const { value: reason } = await Swal.fire({
      title: "Từ chối bài đăng?",
      input: "text",
      inputLabel: "Lý do",
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      confirmButtonColor: "#d33",
      inputValidator: (value) => !value ? "Cần nhập lý do!" : null
    });

    if (reason) {
      const res = await rejectJob(job._id);
      if (res) {
        Swal.fire("Đã từ chối", "", "success");

        await createNotification({
          receiverId: job.createBy._id,
          type: "INFO",
          title: "Bài đăng bị từ chối",
          message: `Bài "${job.jobTitle}" bị từ chối. Lý do: ${reason}`,
          requestId: job._id,
        });

        await sendPostApprovalNotification({
          hr: { fullname: job.createBy.fullname, email: job.createBy.email },
          job: { _id: job._id, title: job.jobTitle },
          status: "banned",
          reason: reason,
        });

        fetchData();
      }
    }
  };

  // 3. Ban
  const handleBan = async (job: any) => {
    const confirm = await Swal.fire({
      title: "Khóa bài đăng?",
      text: "Bài đăng sẽ bị ẩn khỏi hệ thống.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Khóa ngay",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      const res = await banJob(job._id);
      if (res) {
        Swal.fire("Đã khóa", "", "success");
        fetchData();
      }
    }
  };

  // --- HELPER: RENDER TRẠNG THÁI ---
  const renderStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Chờ duyệt";
      case "active": return "Hoạt động";
      case "banned": return "Đã khóa/Từ chối";
      case "expired": return "Hết hạn";
      case "filled": return "Đã tuyển đủ";
      default: return status;
    }
  };

  // --- CORE LOGIC: FILTER & SORT ---
  const filtered = useMemo(() => {
    // 1. Gộp 2 nguồn dữ liệu lại
    // jobList: chứa active, pending, banned
    // exandfillJobsAdmin: chứa expired, filled (lấy từ hook useJob)
    const combinedJobs = [...jobList, ...exandfillJobsAdmin];

    // 2. Loại bỏ trùng lặp (nếu có job nào xuất hiện ở cả 2 API)
    const uniqueJobs = Array.from(new Map(combinedJobs.map(item => [item._id, item])).values());

    // 3. Lọc theo Tab (activeStatus)
    let data = uniqueJobs.filter((job) => {
      if (activeStatus === "exandfill") {
        // Tab này chấp nhận cả 2 trạng thái
        return job.status === "expired" || job.status === "filled";
      }
      return job.status === activeStatus;
    });

    // 4. Lọc theo Search
    if (searchQuery) {
      data = data.filter((job) =>
        job.jobTitle.toLowerCase().includes(searchQuery)
      );
    }

    // 5. Sắp xếp đưa Job cần Active lên đầu
    if (idPostActive) {
      data = [...data].sort((a, b) => {
        // Ép kiểu String để so sánh an toàn
        if (String(a._id) === String(idPostActive)) return -1;
        if (String(b._id) === String(idPostActive)) return 1;
        return 0;
      });
    }

    return data;
  }, [jobList, exandfillJobsAdmin, activeStatus, searchQuery, idPostActive]);

  // --- RENDER ---
  return (
    <div className="post-list-container">
      {/* Tab Bar */}
      <div className="post-tab-bar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`post-tab-btn ${activeStatus === tab.key ? "active" : ""}`}
            onClick={() => setActiveStatus(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="post-search-container">
        <input
          type="text"
          placeholder="Tìm kiếm bài đăng theo tiêu đề..."
          className="post-search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Modal View Detail */}
      {viewJob && (
        <ViewModal
          job={viewJob}
          onClose={() => setViewJob(null)}
          onUpdated={() => { }}
          update={false}
          onOpenChatRequest={() => { }}
          admin={true}
          activeUser=""
        />
      )}

      {/* Danh sách Job */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10">
          <Empty description={`Không có bài đăng nào ở trạng thái "${STATUS_TABS.find(t => t.key === activeStatus)?.label
            }".`} />
        </div>
      ) : (
        <div className="post-grid">
          {filtered.map((job) => {
            const isTargeted = String(idPostActive) === String(job._id);

            return (
              <div
                className="post-card"
                key={job._id}
                // --- STYLE HIGHLIGHT (BLUE TONE) ---
                style={
                  isTargeted
                    ? {
                      border: "2px solid #3b82f6",      // Viền xanh dương
                      backgroundColor: "#eff6ff",       // Nền xanh nhạt
                      boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)", // Bóng đổ xanh
                      transform: "scale(1.02)",
                      transition: "all 0.3s ease",
                      zIndex: 10,
                      position: "relative"
                    }
                    : {}
                }
              >
                {/* Badge Highlight */}
                {isTargeted && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg font-bold z-20 shadow-sm">
                    ĐANG XEM
                  </div>
                )}

                <div className="post-info">
                  <h3 className="flex items-center gap-2 pr-6">
                    {job.jobTitle}
                  </h3>
                  <p className="font-bold text-gray-700 text-center text-2xl">{job.department?.name}</p>
                  <p className="text-sm mt-1 flex gap-2.5">
                    Trạng thái:
                    <span className={`post-status ${job.status} font-semibold capitalize ml-1`}>
                      {renderStatusText(job.status)}
                    </span>
                  </p>
                </div>

                <div className="post-actions">
                  {/* Buttons cho Tab Pending */}
                  {activeStatus === "pending" && (
                    <>
                      <button className="post-btn approve" onClick={() => handleApprove(job)}> <FaCheck /> Duyệt </button>
                      <button className="post-btn reject" onClick={() => handleReject(job)}> <FaTimes /> Từ chối </button>
                    </>
                  )}

                  {/* Button Xem - Luôn hiển thị */}
                  <button className="post-btn view" onClick={() => setViewJob(job)}> <FaRegEye /> Xem </button>

                  {/* Buttons cho Tab Active */}
                  {activeStatus === "active" && (
                    <button className="post-btn reject" onClick={() => handleBan(job)}> <FaTimes /> Khóa </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostAdmin;