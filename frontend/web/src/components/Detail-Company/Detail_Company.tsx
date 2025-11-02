import React, { useEffect, useState } from "react";
import "./Detail_Company.css";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import useDepartment from "../../hook/useDepartment";
import useJob, { type Job } from "../../hook/useJob";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import defaultAVT from "../../assets/images/logo_v1.png";
import wallpaper from "../../assets/images/8840374.jpg";
import { Pagination } from "antd";
import { FaRegEye, FaRegMoneyBillAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RiContrastDrop2Line } from "react-icons/ri";


const Detail_Company: React.FC = () => {
    const JOBS_PER_PAGE = 8;
    const { id } = useParams<{ id: string }>();
    const { department, loading, error, getDepartmentById } = useDepartment("user");
    const { getJobByDepartmentId } = useJob();
    const [jobs, setJobs] = useState<Job[]>([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchCompanyAndJobs = async () => {
            if (!id) return;

            try {
                const js = await getJobByDepartmentId(id);
                setJobs(js || []);
                getDepartmentById(id);

            } catch (err) {
                console.error("Error fetching company and jobs:", err);
            }
        };

        fetchCompanyAndJobs();

        // SỬA LỖI 2: Thêm phụ thuộc
    }, [id, getDepartmentById, getJobByDepartmentId]);

    useEffect(() => {
        if (error) {
            console.error("Failed to fetch:", error);
            Swal.fire("Error", "Failed to fetch company details", "error");
        }
    }, [error]);

    const indexOfLastJob = currentPage * JOBS_PER_PAGE;
    const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    if (loading && currentPage === 1) {
        return <div className="page-container"><h1>Đang tải...</h1></div>;
    }

    if (!department) {
        return <div className="page-container"><h1>Không tìm thấy thông tin công ty.</h1></div>;
    }

    const hanldeView = (id: string) => {
        navigate(
            `/jobdetail/${id}`
        );
    };

    return (
        <div className="detail-company-container">
            <Header />

            <div className="detail-company-body">

                {/* --- Thông tin công ty  --- */}

                <div className="company-info-card bg-white rounded-sm shadow-2xl">
                    <div className="company-banner">
                        <img src={wallpaper} alt="Company Banner" className="company-banner-image" />
                    </div>

                    <div className="company-info-top">
                        <img
                            src={department.avatar || defaultAVT}
                            alt="Company Avatar"
                            className="company-info-avatar"
                        />
                        <div className="company-name-description text-left">
                            <h2 className="company-info-name text-4xl font-bold">
                                {department.name}
                            </h2>
                            <p className="company-info-description text-gray-600 text-justify">
                                {department.description || "Chưa có mô tả về công ty."}
                            </p>
                        </div>
                    </div>

                    <div className="company-info-bottom text-justify" style={{marginTop: 20}}>
                        <p><strong>Địa chỉ:</strong> {department.address || "Chưa cập nhật"}</p>
                        <p className="flex gap-1.5"><strong>Website:</strong> <a className="text-blue-500" href={department.website}>{department.website || "Chưa cập nhật"}</a></p>
                    </div>

                </div>

                {/* --- DANH SÁCH VIỆC LÀM --- */}
                <div className="bg-white company-jobsList shadow-md text-left">
                    <h3 className="text-xl font-semibold" style={{ marginBottom: 20 }}>
                        Việc làm đang tuyển dụng ({jobs.length} việc)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentJobs.length > 0 ? (
                            currentJobs.map(item => (
                                <div key={item._id} className="lasted-item flex flex-col">

                                    <div className="lasted-item_top flex justify-between">
                                        <div className="item-top_left flex justify-around">
                                            <img
                                                src={item.department.avatar}
                                                className="lasted-item_image"
                                            />
                                        </div>
                                        <div className="item-top_center flex flex-col flex-1 text-left">
                                            <p
                                                className="lasted-item-nameJob"
                                                style={{ fontSize: 16, fontWeight: "bold" }}
                                            >
                                                {item.jobTitle}
                                            </p>
                                            <div
                                                style={{
                                                    fontSize: 16,
                                                    paddingTop: 5,
                                                    paddingBottom: 10,
                                                }}
                                                className="lasted-item-department flex gap-4"
                                            >
                                                <p className="text-gray-800">{item.department.name}</p>
                                            </div>
                                            <div className="flex gap-3 lasted-techs flex-wrap">
                                                {item.skills.slice(0, 3).map((i: string, index: number) => (
                                                    <div key={index} className="lasted-tech-item">
                                                        {i.length > 10 ? i.slice(0, 10) + "..." : i}
                                                    </div>
                                                ))}
                                                {item.skills.length > 3 && (
                                                    <div className="lasted-tech-item">...</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="item-top_right">
                                            <button
                                                className="btn-apply"
                                                onClick={() => hanldeView(item._id)}
                                            >
                                                <FaRegEye />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="lasted-item_bottom gap-2" style={{ marginTop: 10 }}>
                                        <ul className="flex gap-6 flex-1">
                                            <li
                                                className="bottom-li flex gap-3 items-center"
                                                style={{ fontSize: 13 }}
                                            >
                                                <IoLocationOutline color="#059669" /> {item.location}
                                            </li>
                                            <li
                                                className="bottom-li flex gap-3 items-center"
                                                style={{ fontSize: 13 }}
                                            >
                                                <FaRegMoneyBillAlt color="#059669" /> {item.salary}
                                            </li>
                                            <li
                                                className="bottom-li flex gap-3 items-center"
                                                style={{ fontSize: 13 }}
                                            >
                                                <AiOutlineClockCircle color="#059669" />
                                                {item.jobType}
                                            </li>
                                            <li
                                                className="bottom-li flex gap-3 items-center"
                                                style={{ fontSize: 13 }}
                                            >
                                                <RiContrastDrop2Line color="#059669" />
                                                {item.jobLevel}
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Công ty hiện chưa có tin tuyển dụng nào.</p>
                        )}
                    </div>

                    <div style={{ marginTop: '24px', textAlign: 'center' }} className="flex justify-center items-center">
                        <Pagination
                            current={currentPage}
                            total={jobs.length}
                            pageSize={JOBS_PER_PAGE}
                            onChange={(page) => setCurrentPage(page)}
                            hideOnSinglePage={true}
                        />
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Detail_Company;