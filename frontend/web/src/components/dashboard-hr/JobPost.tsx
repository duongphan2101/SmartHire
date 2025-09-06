import React, { useState } from "react";
import "./JobPost.css";
import AddJobmodal from "../dashboard-hr/AddJobmodal"; 

const JobPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="job-post-container">
      <div className="search-wrapper">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
          <button className="add-button" onClick={handleAddClick}>
            Thêm
          </button>
        </div>
        </div>
      {isModalOpen && <AddJobmodal onClose={handleCloseModal} />}
    </div>
  );
};

export default JobPost;