import React, { useState, useRef } from "react";
import "./AllJobPost.css";
import AddJobModal from "../dashboard-hr/AddJobmodal";
import ViewModal from "../dashboard-hr/Viewmodal";
import useJob from "../../hook/useJob";
import { HOSTS } from "../../utils/host";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import Swal from "sweetalert2";
import { Empty } from "antd";
import type { ChatRoom } from "../../utils/interfaces";
import useDepartment from "../../hook/useDepartment";


interface AllJobPostProps {
  onOpenChatRequest: (room: ChatRoom) => void;
}

const AllJobPost = ({ onOpenChatRequest }: AllJobPostProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { jobs, loading, error, refetch } = useJob();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [viewJob, setViewJob] = useState<any | null>(null);
  const { department } = useDepartment("user");

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleAddClick = () => {
    if (department?.status === "Pending") {
      Swal.fire({
        icon: "warning",
        title: "Công ty đang chờ duyệt",
        text: "Bạn không thể tạo bài đăng cho đến khi admin phê duyệt.",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveJob = async () => {
    await refetch();
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Hủy timeout cũ trước khi tạo cái mới (tránh spam API)
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Chờ 400ms sau khi ngừng gõ mới gọi API
    searchTimeout.current = setTimeout(async () => {
      if (value.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(`${HOSTS.jobService}/search?q=${value}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Error searching jobs:", err);
      }
    }, 400);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-2xl" style={{ padding: 20 }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có bài đăng!" /></div>;

  const jobsToRender = searchResults.length > 0 ? searchResults : jobs;

  return (
    <div className="all-job-post-container">
      <div className="all-search-container">
        <input
          type="text"
          placeholder="Tìm kiếm bằng tên người đăng hoặc tên bài đăng"
          className="all-search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="all-add-button" onClick={handleAddClick}>
          <AiOutlinePlusCircle size={20} />
          Thêm
        </button>
      </div>

      {isModalOpen && (
        <AddJobModal onClose={handleCloseModal} onSave={handleSaveJob} />
      )}

      {viewJob && (
        <ViewModal
          job={viewJob}
          onClose={() => setViewJob(null)}
          onUpdated={refetch}
          update={false}
          onOpenChatRequest={onOpenChatRequest}
          admin={true}
        />
      )}

      <div className="all-job-cards">
        {Array.isArray(jobsToRender) && jobsToRender.map((job) => (
          <div className="all-job-card" key={job._id}>
            <div className="job-card-header flex items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{job.jobTitle}</h3>

                {job.status !== "active" && (
                  <span
                    className={`badge-jobStatus px-2 py-1 rounded-md text-xs font-semibold ${job.status === "filled"
                      ? "bg-green-100 text-green-700"
                      : job.status === "expired"
                        ? "bg-red-100 text-red-600"
                        : job.status === "banned"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-amber-200 text-amber-600"
                      }`}
                  >
                    {job.status === "filled"
                      ? "Đã tuyển đủ"
                      : job.status === "expired"
                        ? "Hết hạn"
                        : job.status === "banned"
                          ? "Tạm khóa"
                          : "Đợi duyệt"}
                  </span>
                )}

              </div>
            </div>
            <div className="all-job-body">
              <div className="flex items-center justify-between">
                <span className="all-job-date" style={{ marginTop: 0 }}>
                  {new Date(job.createdAt).toLocaleDateString()} -{" "}
                  {new Date(job.endDate).toLocaleDateString()}
                </span>
                <p>{job.jobType}</p>
              </div>
              {job.skills.length > 0 && (
                <div className="all-job-skills">
                  {job.skills.slice(0, 3).map((skill: string, index: number) => (
                    <span key={index}>
                      {skill.length > 15 ? skill.slice(0, 15) + "…" : skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && <span>...</span>}
                </div>
              )}
            </div>
            <div className="all-job-footer">
              <div className="flex gap-3 flex-wrap">
                <span style={{ fontSize: 13 }} className="font-bold text-gray-500">
                  {job.salary}
                </span>
                <span style={{ fontSize: 13 }} className="all-job-address text-gray-400">
                  {job.address}
                </span>
              </div>
              <button
                className="all-details-button"
                onClick={() => setViewJob(job)}
              >
                <FaRegEye size={18} color="#fff" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllJobPost;