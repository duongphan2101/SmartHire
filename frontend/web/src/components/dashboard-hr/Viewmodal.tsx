import React from "react";
import "./ViewModal.css";

const ViewModal = ({ job, onClose }: { job: any; onClose: () => void }) => {
  if (!job) return null;

  return (
    <div className="view-modal-overlay">
  <div className="view-modal">
    <button className="close-btn" onClick={onClose}>×</button>
    <h2>{job.jobTitle}</h2>

    <div className="job-info">
      <p><b>Loại công việc:</b> {job.jobType}</p>
      <p><b>Kỹ năng:</b> {job.skills.join(", ")}</p>
      <p><b>Lương:</b> {job.salary}/hr</p>
      <p><b>Địa chỉ:</b> {job.address}</p>
    </div>

    <div className="job-description">
      <b>Mô tả công việc:</b> <br />
      {job.jobDescription}
    </div>

    <div className="job-date">
      Ngày tạo: {new Date(job.createdAt).toLocaleString()}
    </div>
  </div>
</div>

  );
};

export default ViewModal;
