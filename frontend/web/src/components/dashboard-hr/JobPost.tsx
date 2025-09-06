import React, { useState } from "react";
import "./JobPost.css";
import AddJobModal from "../dashboard-hr/AddJobmodal";
import ViewModal from "../dashboard-hr/Viewmodal"; 
import useJob from "../../hook/useJob";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const JobPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { jobs, loading, error, refetch } = useJob();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [viewJob, setViewJob] = useState<any | null>(null); // ⬅ job đang được xem

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
      <div className="search-wrapper">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title or skill"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="add-button" onClick={handleAddClick}>
            Thêm
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AddJobModal onClose={handleCloseModal} onSave={handleSaveJob} />
      )}

      {viewJob && (
        <ViewModal job={viewJob} onClose={() => setViewJob(null)} />
      )}

      <div className="job-cards">
        {jobsToRender.map((job) => (
          <div className="job-card" key={job._id}>
            <div className="job-card-header">
              <span className="job-date">
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <button
                className="close-card-button"
                onClick={() => handleRemoveJob(job._id)}
              >
                ×
              </button>
            </div>
            <h3>{job.jobTitle}</h3>
            <p>{job.jobType}</p>
            {job.skills.length > 0 && (
              <div className="job-skills">
                {job.skills.map((skill: string, index: number) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            )}
            <div className="job-footer">
              <span>{job.salary}/hr</span>
              <span>{job.address}</span>
              <button
                className="details-button"
                onClick={() => setViewJob(job)} // ⬅ mở modal
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobPost;
