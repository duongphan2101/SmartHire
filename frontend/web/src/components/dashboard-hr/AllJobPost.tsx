import React, { useState, useRef } from "react";
import "./AllJobPost.css";
import AddJobModal from "../dashboard-hr/AddJobmodal";
import ViewModal from "../dashboard-hr/Viewmodal";
import useJob from "../../hook/useJob";
import { HOSTS } from "../../utils/host";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";


const AllJobPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { jobs, loading, error, refetch } = useJob();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [viewJob, setViewJob] = useState<any | null>(null);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleAddClick = () => setIsModalOpen(true);
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
  if (error) return <div className="text-2xl"
    style={{ padding: 20 }}>Không có bài đăng tuyển dụng nào!</div>;

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
        />
      )}

      <div className="all-job-cards">
        {Array.isArray(jobsToRender) && jobsToRender.map((job) => (
          <div className="all-job-card" key={job._id}>
            <div className="all-job-card-header">
              <h3 className="font-bold">{job.jobTitle}</h3>
              {/* <button
                className="all-close-card-button"
                onClick={() => handleRemoveJob(job._id)}
              >
                ×
              </button> */}
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