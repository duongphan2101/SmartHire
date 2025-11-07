import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useUser from "../../hook/useUser";
import useJob from "../../hook/useJob";
import { useNavigate } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RiContrastDrop2Line } from "react-icons/ri";
import { FaRegEye, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";
import "./jobSave.css";
import Chat from "../../components/Chat/Chat";

const JobSave: React.FC = () => {
  const { user, getUser, unsaveJob } = useUser();
  const { getJobById } = useJob();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy user từ localStorage nếu chưa có
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

  // Fetch danh sách job đã lưu ban đầu
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user && user.liked?.length > 0) {
        const jobsData = await Promise.all(
          user.liked.map((jobId: string) => getJobById(jobId))
        );
        setSavedJobs(jobsData.filter(Boolean));
      } else {
        setSavedJobs([]);
      }
      setLoading(false);
    };
    if (user?._id) {
      fetchSavedJobs();
    }
  }, [user?._id, getJobById]);

  // Xem chi tiết
  const handleView = (jobId: string) => {
    navigate(`/jobdetail/${jobId}`);
  };

  // Bỏ lưu job
  const handleUnsave = async (jobId: string) => {
    if (!user?._id) return;

    try {
      const updatedUser = await unsaveJob(user._id, jobId);
      if (!updatedUser) return;

      // Xóa job ngay khỏi danh sách FE
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));

      Swal.fire({
        icon: "success",
        title: "Đã bỏ lưu",
        text: "Công việc đã được bỏ lưu thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Unsave job error:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể bỏ lưu công việc, vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="App">
      <Header />
      <Chat />
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
                    <div className="job-save-avt">
                      <img
                        src={item.department?.avatar}
                        alt="company"
                        className="job-save-avatar"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="job-title">{item.jobTitle}</h3>
                      <p className="job-department">{item.department?.name}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 ">
                    <button
                      className="btn-view"
                      onClick={() => handleView(item._id)}
                    >
                      <FaRegEye /> Xem
                    </button>
                    <button
                      className="btn-unsave"
                      onClick={() => handleUnsave(item._id)}
                    >
                      <FaTrash /> Bỏ lưu
                    </button>
                  </div>
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
