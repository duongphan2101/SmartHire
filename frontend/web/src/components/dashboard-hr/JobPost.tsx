import React, { useState } from "react";
import "./JobPost.css";
import AddJobModal from "../dashboard-hr/AddJobmodal";
import ViewModal from "../dashboard-hr/Viewmodal";
import useJob from "../../hook/useJob";
// BỔ SUNG: Import useDepartment để lấy trạng thái công ty
import useDepartment from "../../hook/useDepartment";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { Empty } from "antd";

const MySwal = withReactContent(Swal);

const JobPost = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { jobs: allJobs, loading, error, refetch } = useJob();

    // BỔ SUNG: Lấy thông tin công ty từ useDepartment
    // Giả định useDepartment("user") trả về { department: DepartmentData | null }
    const { department } = useDepartment("user");

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = currentUser._id || currentUser.user_id;
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [viewJob, setViewJob] = useState<any | null>(null);

    // Lọc job của HR hiện tại
    const jobs = Array.isArray(allJobs)
        ? allJobs.filter((job) => String(job?.createBy?._id) === String(currentUserId))
        : [];

    const handleAddClick = () => {
        // 1. Kiểm tra trạng thái Tạm khóa
        if (department && department.status === 'Suspended') {
            MySwal.fire({
                title: "Tạo tin thất bại ⛔",
                html: "Công ty của bạn hiện đang ở trạng thái **Tạm khóa** (Suspended) bởi Quản trị viên. Bạn không thể đăng tin tuyển dụng mới. Vui lòng liên hệ Admin để được hỗ trợ.",
                icon: "error",
                confirmButtonText: "Đã hiểu",
                customClass: {
                    htmlContainer: 'text-left'
                }
            });
            return; // Chặn mở Modal
        }

        // 2. Kiểm tra trạng thái Lưu trữ (nếu cần)
        if (department && department.status === 'Archived') {
            MySwal.fire({
                title: "Tạo tin thất bại ❌",
                html: "Công ty của bạn đã bị **Lưu trữ** (Archived). Vui lòng liên hệ Admin.",
                icon: "error",
                confirmButtonText: "Đã hiểu"
            });
            return; // Chặn mở Modal
        }

        // Nếu trạng thái là 'Active' hoặc không có department (sẽ được xử lý khi submit form)
        setIsModalOpen(true);
    };

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
    // Hiển thị lỗi từ useJob
    if (error) return <div className="text-2xl" style={{ padding: 20 }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có bài đăng!"/></div>;

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
                {Array.isArray(jobsToRender) && jobsToRender.map((job) => (
                    <div className="job-card" key={job._id}>

                        <div className="job-card-header flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold">{job.jobTitle}</h3>

                                {job.status !== "active" && (
                                    <span
                                        className={`badge-jobStatus ${job.status === "expired"
                                            ? "bg-red-100 text-red-600"
                                            : job.status === "banned"
                                                ? "bg-gray-200 text-gray-600"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {job.status === "expired"
                                            ? "Hết hạn"
                                            : job.status === "banned"
                                                ? "Tạm khóa"
                                                : job.status}
                                    </span>
                                )}
                            </div>

                            <button
                                className="close-card-button text-lg font-bold text-gray-500 hover:text-black"
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