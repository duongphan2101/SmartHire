import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useUser from "../../hook/useUser";
import useJob from "../../hook/useJob";
import { useNavigate } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegMoneyBillAlt, FaRegBookmark } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RiContrastDrop2Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import "./JobSave.css";

const JobSave: React.FC = () => {
  const { user, getUser } = useUser();
  const { getJobById } = useJob();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const idToFetch = parsed.user_id ?? parsed._id;
        getUser(idToFetch);
      }
    }
  }, [user, getUser]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user && user.liked?.length > 0) {
        const jobsData = await Promise.all(
          user.liked.map((jobId: string) => getJobById(jobId))
        );
        setSavedJobs(jobsData.filter(Boolean));
      }
      setLoading(false); 
    };
    fetchSavedJobs();
  }, [user, getJobById]);

  const handleView = (jobId: string) => {
    navigate(`/jobdetail/${jobId}`);
  };

  return (
    <div className="App">
      <Header />

      <div className="job-save-container">
        <h2 className="job-save-title">Công việc đã lưu</h2>

        {loading ? (
          <p className="job-save-loading">Đang tải danh sách...</p>
        ) : savedJobs.length === 0 ? (
          <p className="job-save-empty">Bạn chưa lưu công việc nào.</p>
        ) : (
          <div className="job-save-grid">
            {savedJobs.map((item) => (
              <div key={item._id} className="job-save-card flex flex-col">
                <div className="job-save-card-top flex justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={item.department?.avatar}
                      alt="company"
                      className="job-save-avatar"
                    />
                    <div className="flex flex-col text-left">
                      <h3 className="job-title">{item.jobTitle}</h3>
                      <p className="job-department">{item.department?.name}</p>
                    </div>
                  </div>

                  <button
                    className="btn-view"
                    onClick={() => handleView(item._id)}
                  >
                    <FaRegEye /> Xem
                  </button>
                </div>

                <ul className="job-details flex gap-6 flex-1 mt-3">
                  <li className="flex gap-2 items-center">
                    <IoLocationOutline color="#059669" /> {item.location}
                  </li>
                  <li className="flex gap-2 items-center">
                    <FaRegMoneyBillAlt color="#059669" /> {item.salary}
                  </li>
                  <li className="flex gap-2 items-center">
                    <AiOutlineClockCircle color="#059669" /> {item.jobType}
                  </li>
                  <li className="flex gap-2 items-center">
                    <RiContrastDrop2Line color="#059669" /> {item.jobLevel}
                  </li>
                </ul>

                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                  <FaRegBookmark /> Đã lưu
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};


export default JobSave;
