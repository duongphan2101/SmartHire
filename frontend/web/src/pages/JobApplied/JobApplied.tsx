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
import "./jobApplied.css";

const JobApplied: React.FC = () => {
  const { user, getUser, applyJob } = useUser(); // Sử dụng applyJob để cập nhật nếu cần
  const { getJobById } = useJob();
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
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

  // Fetch danh sách job đã ứng tuyển ban đầu
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (user && user.applyted?.length > 0) {
        const jobsData = await Promise.all(
          user.applyted.map((jobId: string) => getJobById(jobId))
        );
        setAppliedJobs(jobsData.filter(Boolean));
      } else {
        setAppliedJobs([]);
      }
      setLoading(false);
    };
    if (user?._id) {
      fetchAppliedJobs();
    }
  }, [user?._id, getJobById]);

  // Xem chi tiết
  const handleView = (jobId: string) => {
    navigate(`/jobdetail/${jobId}`);
  };

  // Hủy ứng tuyển (nếu cần chức năng này)
  const handleUnapply = async (jobId: string) => {
    if (!user?._id) return;

    try {
      // Gọi API để hủy ứng tuyển (cần thêm logic backend)
      // Ví dụ: await applyJob(user._id, jobId, { unapply: true });
      const updatedUser = await applyJob(user._id, jobId); // Cập nhật logic backend
      if (!updatedUser) return;

      // Xóa job ngay khỏi danh sách FE
      setAppliedJobs((prev) => prev.filter((job) => job._id !== jobId));

      Swal.fire({
        icon: "success",
        title: "Đã hủy ứng tuyển",
        text: "Công việc đã được hủy ứng tuyển thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Unapply job error:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể hủy ứng tuyển, vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="App">
      <Header />

      <div className="job-applied-container">
        <h2 className="job-applied-title">Công việc đã ứng tuyển</h2>

        {loading ? (
          <p className="job-applied-loading">Đang tải danh sách...</p>
        ) : appliedJobs.length === 0 ? (
          <p className="job-applied-empty">Bạn chưa ứng tuyển công việc nào.</p>
        ) : (
          <div className="job-applied-grid">
            {appliedJobs.map((item) => (
              <div key={item._id} className="job-applied-card flex flex-col">
                <div className="job-applied-card-top flex justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="job-applied-avt">
                      <img
                        src={item.department?.avatar}
                        alt="company"
                        className="job-applied-avatar"
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

export default JobApplied;