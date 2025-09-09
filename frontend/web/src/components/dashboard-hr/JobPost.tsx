import React, { useState } from "react";
import "./JobPost.css";
import AddJobModal from "../dashboard-hr/AddJobmodal";
import ViewModal from "../dashboard-hr/Viewmodal";
import useJob from "../../hook/useJob";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';

const MySwal = withReactContent(Swal);

const JobPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { jobs, loading, error, refetch } = useJob();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [viewJob, setViewJob] = useState<any | null>(null);

  const handleAddClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveJob = async () => {
    await refetch();
    setIsModalOpen(false);
  };

  const handleRemoveJob = async (id: string) => {
    const result = await MySwal.fire({
      title: "Bạn có chắc chắn?",
      text: "Công việc này sẽ bị xóa và không thể khôi phục!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(241, 0, 0, 1)",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${HOSTS.jobService}/${id}`, { method: "DELETE" });
        await refetch();
        MySwal.fire("Đã xóa!", "Công việc đã được xóa thành công.", "success");
      } catch (err) {
        console.error("Error deleting job:", err);
        MySwal.fire("Lỗi!", "Không thể xóa công việc.", "error");
      }
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

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
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  // Nếu có searchResults thì ưu tiên render nó
  const jobsToRender = searchResults.length > 0 ? searchResults : jobs;

  return (
    <div className="job-post-container">

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm bằng tên người đăng hoặc tên bài đăng"
          className="search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="add-button" onClick={handleAddClick}>
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
  />
)}

      <div className="job-cards">
        {jobsToRender.map((job) => (
          <div className="job-card" key={job._id}>
            <div className="job-card-header">
              <h3 className="font-bold">{job.jobTitle}</h3>
              <button
                className="close-card-button"
                onClick={() => handleRemoveJob(job._id)}
              >
                ×
              </button>
            </div>
            <div className="job-body">
              <div className="flex items-center justify-between">
                <span className="job-date" style={{ marginTop: 0 }}>
                  {new Date(job.createdAt).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
                </span>
                <p>{job.jobType}</p>
              </div>
              {job.skills.length > 0 && (
                <div className="job-skills">
                  {job.skills.slice(0, 3).map((skill: string, index: number) => (
                    <span key={index}>
                      {skill.length > 15 ? skill.slice(0, 15) + "…" : skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && <span>...</span>}
                </div>
              )}
            </div>
            <div className="job-footer">
              <span className="font-bold text-gray-500">{job.salary}</span>
              <span className="job-address text-gray-400">{job.address}</span>
              <button
                className="details-button"
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

export default JobPost;
