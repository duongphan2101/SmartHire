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
  { key: "banned", label: "Đã từ chối/khóa" },
];

// --- INTERFACE PROPS ---
interface PostAdminProps {
  idPostActive?: string;
  status?: string;
}

const PostAdmin: React.FC<PostAdminProps> = ({ idPostActive, status }) => {
  // --- HOOKS ---
  const { approveJob, rejectJob, fetchAllJob, banJob } = useJob();
  const { createNotification } = useNotification();
  const { sendPostApprovalNotification } = useEmailService();

  // --- STATE ---
  const [jobList, setJobList] = useState<any[]>([]);

  const [activeStatus, setActiveStatus] = useState(status || "pending");

  const [searchQuery, setSearchQuery] = useState("");
  const [viewJob, setViewJob] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status) {
      setActiveStatus(status);
    }
  }, [status]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const jobData = await fetchAllJob();
      setJobList(jobData || []);
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

  // 1. Xử lý Duyệt bài (Approve)
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
        message: `Bài đăng tuyển dụng "${job.jobTitle}" của bạn đã được duyệt và đang hiển thị.`,
        requestId: job._id,
      });

      // Gửi email
      await sendPostApprovalNotification({
        hr: { fullname: job.createBy.fullname, email: job.createBy.email },
        job: { _id: job._id, title: job.jobTitle },
        status: "active",
        reason: "",
      });

      fetchData(); // Refresh lại danh sách
    }
  };

  // 2. Xử lý Từ chối bài (Reject - khi đang Pending)
  const handleReject = async (job: any) => {
    const { value: reason } = await Swal.fire({
      title: "Từ chối bài đăng?",
      input: "text",
      inputLabel: "Lý do từ chối",
      inputPlaceholder: "Nhập lý do cụ thể...",
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      confirmButtonColor: "#d33",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value) {
          return "Bạn cần nhập lý do để HR biết cần sửa gì!";
        }
      }
    });

    if (reason) {
      const res = await rejectJob(job._id);
      if (res) {
        Swal.fire("Đã từ chối!", "Bài đăng đã bị từ chối.", "success");

        await createNotification({
          receiverId: job.createBy._id,
          type: "INFO",
          title: "Bài đăng bị từ chối",
          message: `Bài đăng "${job.jobTitle}" bị từ chối. Lý do: ${reason}`,
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

  // 3. Xử lý Khóa bài (Ban - khi đang Active - Thường dùng cho report)
  const handleBan = async (job: any) => {
    const confirm = await Swal.fire({
      title: "Khóa bài đăng này?",
      text: "Bài đăng sẽ bị ẩn khỏi hệ thống và chuyển sang trạng thái Khóa.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Khóa ngay",
      confirmButtonColor: "#d33",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    const res = await banJob(job._id);
    if (res) {
      Swal.fire("Đã khóa!", "Bài đăng đã chuyển sang trạng thái bị khóa.", "success");

      await createNotification({
        receiverId: job.createBy._id,
        type: "WARNING",
        title: "Bài đăng bị khóa",
        message: `Bài đăng "${job.jobTitle}" đã bị khóa bởi quản trị viên do vi phạm chính sách.`,
        requestId: job._id,
      });

      await sendPostApprovalNotification({
        hr: { fullname: job.createBy.fullname, email: job.createBy.email },
        job: { _id: job._id, title: job.jobTitle },
        status: "banned",
        reason: "Vi phạm chính sách cộng đồng (Báo cáo từ người dùng)",
      });

      fetchData();
    }
  };

  const filtered = useMemo(() => {
    let data = jobList.filter((job) => job.status === activeStatus);

    if (searchQuery) {
      data = data.filter((job) =>
        job.jobTitle.toLowerCase().includes(searchQuery)
      );
    }

    // Sắp xếp đưa Job cần Active lên đầu
    if (idPostActive) {
      data = [...data].sort((a, b) => {
        // FIX: Ép kiểu String để so sánh an toàn
        if (String(a._id) === String(idPostActive)) return -1;
        if (String(b._id) === String(idPostActive)) return 1;
        return 0;
      });
    }

    return data;
  }, [jobList, activeStatus, searchQuery, idPostActive]);

  return (
    <div className="post-list-container">
      {/* 1. Tab Bar */}
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

      {/* 2. Search Bar */}
      <div className="post-search-container">
        <input
          type="text"
          placeholder="Tìm kiếm bài đăng theo tiêu đề..."
          className="post-search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* 3. Modal Xem Chi Tiết */}
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

      {/* 4. Danh sách Job */}
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
            // console.log("Check:", {
            //   idProps: idPostActive,
            //   typeProps: typeof idPostActive,
            //   idJob: job._id,
            //   typeJob: typeof job._id,
            //   match: isTargeted
            // });

            return (
              <div
                className="post-card"
                key={job._id}
                style={
                  isTargeted
                    ? {
                      border: "2px solid #3b82f6",      // Viền xanh dương (Blue-500)
                      backgroundColor: "#eff6ff",       // Nền xanh cực nhạt (Blue-50)
                      boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)", // Bóng đổ xanh
                      transform: "scale(1.02)",
                      transition: "all 0.3s ease",
                      zIndex: 10,
                      position: "relative"
                    }
                    : {}
                }
              >
                {isTargeted && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-bl-lg font-bold z-20 shadow-sm"
                    style={{ padding: "4px 8px" }}
                  >
                    ĐANG XEM
                  </div>
                )}

                <div className="post-info">
                  <h3 className="flex items-center gap-2 pr-6">
                    {job.jobTitle}
                  </h3>
                  <p className="font-bold text-gray-700">{job.department?.name}</p>
                  <p className="text-sm mt-1">
                    Trạng thái:{" "}
                    <span className={`post-status ${job.status} font-semibold capitalize`}>
                      {job.status === "pending"
                        ? "Chờ duyệt"
                        : job.status === "active"
                          ? "Hoạt động"
                          : "Đã khóa/Từ chối"}
                    </span>
                  </p>
                </div>

                <div className="post-actions">
                  {/* Buttons cho Tab Pending */}
                  {activeStatus === "pending" && (
                    <>
                      <button
                        className="post-btn approve"
                        onClick={() => handleApprove(job)}
                        title="Duyệt bài đăng này"
                      >
                        <FaCheck /> Duyệt
                      </button>
                      <button
                        className="post-btn reject"
                        onClick={() => handleReject(job)}
                        title="Từ chối bài đăng này"
                      >
                        <FaTimes /> Từ chối
                      </button>
                    </>
                  )}

                  <button
                    className="post-btn view"
                    onClick={() => setViewJob(job)}
                    title="Xem chi tiết"
                  >
                    <FaRegEye /> Xem
                  </button>

                  {activeStatus === "active" && (
                    <button
                      className="post-btn reject"
                      onClick={() => handleBan(job)}
                      title="Khóa bài đăng này (Do vi phạm)"
                    >
                      <FaTimes /> Khóa
                    </button>
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