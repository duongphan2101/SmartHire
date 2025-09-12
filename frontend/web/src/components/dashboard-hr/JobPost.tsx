import React, { useState } from "react";
import "./JobPost.css";
import AddJobModal from "../dashboard-hr/AddJobmodal";
import ViewModal from "../dashboard-hr/Viewmodal";
import useJob from "../../hook/useJob";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";

const MySwal = withReactContent(Swal);

const JobPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { jobs: allJobs, loading, error, refetch } = useJob();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser._id || currentUser.user_id;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [viewJob, setViewJob] = useState<any | null>(null);

  // Lọc job của HR hiện tại
  const jobs = allJobs.filter((job) => job.createBy._id === currentUserId);

  const handleAddClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveJob = async () => {
    await refetch();
  };

  const handleRemoveJob = async (id: string) => {
    const jobToDelete = jobs.find((j) => j._id === id);
    if (!jobToDelete) {
      MySwal.fire("Lỗi!", "Không tìm thấy công việc để xóa.", "error");
      return;
    }

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
      // Lọc kết quả tìm kiếm theo userId
      const filteredResults = data.filter((job: any) => job.createBy._id === currentUserId);
      setSearchResults(filteredResults);
    } catch (err) {
      console.error("Error searching jobs:", err);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-2xl"
    style={{ padding: 20 }}>{error}</div>;

  // Sử dụng jobs đã lọc thay vì allJobs
  const jobsToRender = searchResults.length > 0 ? searchResults : jobs;

  return (
    <div className="job-post-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm bài đăng của bạn"
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
          update={true}
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
                  {new Date(job.createdAt).toLocaleDateString()} -{" "}
                  {new Date(job.endDate).toLocaleDateString()}
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
              <div className="flex gap-3 flex-wrap">
                <span style={{ fontSize: 13 }} className="font-bold text-gray-500">
                  {job.salary}
                </span>
                <span style={{ fontSize: 13 }} className="job-address text-gray-400">
                  {job.address}
                </span>
              </div>
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