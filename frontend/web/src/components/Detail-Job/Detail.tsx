import React, { useState, useEffect } from "react";
import "./Detail.css";

import page from "../../assets/images/page-picture.jpg";
import Map from "../Map/Map";
import Model from "../Model-Apply/Model-Apply";

import { FaLocationDot } from "react-icons/fa6";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { MdApartment } from "react-icons/md";
import { AiFillClockCircle } from "react-icons/ai";
import { BiSolidTimer } from "react-icons/bi";

import useUser, { type UserResponse } from "../../hook/useUser";

import Swal from "sweetalert2";

interface Department {
    _id: string;
    name: string;
    avatar?: string;
}

interface Job {
    _id: string;
    jobTitle: string;
    department: Department;
    jobDescription: string[] | string;
    jobLevel: string;
    jobType: string;
    requirement: string[] | string;
    skills: string[] | string;
    benefits: string[] | string;
    salary: string;
    location: string;
    workingHours: string;
    address: string;
    experience: string;
    isSaved?: boolean;
    createAt?: string;
    updatedAt?: string;
}

interface DetailProps {
    item: Job;
    saveJob: (userId: string, jobId: string) => Promise<UserResponse | void>;
    unsaveJob: (userId: string, jobId: string) => Promise<UserResponse | void>;
}

const Detail: React.FC<DetailProps> = ({ item, saveJob, unsaveJob }) => {
    const [saved, setSaved] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [openModel, setOpenModel] = useState<boolean>(false);
    const { getUser: fetchUser, user: currentUser } = useUser();
    const [applyted, setApplyted] = useState<boolean>(false);

    // Lấy user từ localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const idToFetch = parsedUser.user_id ?? parsedUser._id;
            setUser(parsedUser);
            if (parsedUser.liked?.includes(item._id)) {
                setSaved(true);
            }
            fetchUser(idToFetch);
        }
    }, [item._id]);

    useEffect(() => {
        if (currentUser && Array.isArray(currentUser.applyted)) {
            setApplyted(currentUser.applyted.includes(item._id));
        }
    }, [currentUser, item._id]);

    const applyJob = async () => {
        if (!user || !(user._id || user.user_id)) {
            Swal.fire({
                icon: "warning",
                title: "Bạn chưa đăng nhập",
                text: "Vui lòng đăng nhập để lưu công việc!",
                confirmButtonText: "Đăng nhập ngay",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/login";
                }
            });
            return;
        }

        if (applyted) {
            Swal.fire({
                icon: "info",
                title: "Bạn đã ứng tuyển",
                text: "Không thể ứng tuyển lại công việc này.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        setOpenModel(true);
    }

    const toggleSave = async () => {
        if (!user || !(user._id || user.user_id)) {
            Swal.fire({
                icon: "warning",
                title: "Bạn chưa đăng nhập",
                text: "Vui lòng đăng nhập để lưu công việc!",
                confirmButtonText: "Đăng nhập ngay",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/login";
                }
            });
            return;
        }

        const userId = user._id || user.user_id;
        const isSavedNext = !saved;
        setSaved(isSavedNext);

        try {
            if (isSavedNext) {
                await saveJob(userId, item._id);
                Swal.fire({
                    icon: "success",
                    title: "Đã lưu công việc",
                    text: "Công việc đã được thêm vào danh sách lưu.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                await unsaveJob(userId, item._id);
                Swal.fire({
                    icon: "info",
                    title: "Đã bỏ lưu công việc",
                    text: "Công việc đã được xóa khỏi danh sách lưu.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            console.error("Error toggle save:", err);
            setSaved(!isSavedNext);

            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Có lỗi xảy ra khi lưu/unsave công việc. Vui lòng thử lại!",
            });
        }
    };

    const getTimeAgo = (postedAt: string, updatedAt?: string): string => {
        const date = new Date(updatedAt || postedAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return "Vừa xong";
        if (diffMinutes < 60) return `${diffMinutes} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        return `${diffDays} ngày trước`;
    };

    const experienceMap: { [key: string]: string } = {
        none: "Không yêu cầu",
        lt1: "Dưới 1 năm",
        "1-3": "1 - 3 năm",
        "3-5": "3 - 5 năm",
        "5-7": "5 - 7 năm",
        "7-10": "7 - 10 năm",
        gt10: "Trên 10 năm"
    };

    return (
        <div className="detail-container w-full">
            <div className="page-picture">
                <img className="bg-picture" src={page} alt="page-picture" />
            </div>

            <Model
                _id={item._id}
                jobTitle={item.jobTitle}
                department={item.department.name}
                open={openModel}
                onClose={() => setOpenModel(false)}
                userId={user}
            />

            <div className="page-title w-full flex flex-col gap-3">
                <img className="avt-department" src={item.department.avatar} />
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-left title-job">{item.jobTitle}</span>
                        <a
                            className="text-left text-gray-600"
                            href={`/department/${item.department._id}`}
                            style={{ fontSize: 18 }}
                        >
                            <span className="department-item-name">{item.department.name}</span>
                        </a>
                    </div>

                    <div className="experience-box">
                        Kinh nghiệm: {experienceMap[item.experience] || "Không rõ"}
                    </div>
                </div>
            </div>

            <div className="page-content-main text-left">
                <div className="content-main-top">
                    <div className="flex w-full">
                        <div className="grid grid-cols-12 gap-4 w-full">
                            {/* LEFT */}
                            <div className="col-span-12 md:col-span-7">
                                <h3 className="content-title">Về công việc này</h3>
                                {Array.isArray(item.jobDescription) ? (
                                    <ul className="list-disc pl-5 py-2">
                                        {item.jobDescription.map((res, idx) => (
                                            <li className="li-job-item" key={idx}>
                                                {res}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="py-2">{item.jobDescription}</p>
                                )}

                                <h3 className="content-title">Cấp bậc</h3>
                                <p className="py-2 pl-4">•  {item.jobLevel}</p>

                                <h3 className="content-title">Hình thức làm việc</h3>
                                <p className="py-2 pl-4">•  {item.jobType}</p>

                                <h3 className="content-title">Trách nhiệm chính</h3>
                                {Array.isArray(item.requirement) ? (
                                    <ul className="list-disc pl-5 py-2">
                                        {item.requirement.map((res, idx) => (
                                            <li className="li-job-item" key={idx}>
                                                {res}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="py-2">{item.requirement}</p>
                                )}

                                <h3 className="content-title">Kỹ năng cần có</h3>
                                {Array.isArray(item.skills) ? (
                                    <ul className="list-disc pl-5 py-2">
                                        {item.skills.map((res, idx) => (
                                            <li className="li-job-item" key={idx}>
                                                {res}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="py-2">{item.skills}</p>
                                )}

                                <h3 className="content-title">Phúc lợi</h3>
                                {Array.isArray(item.benefits) ? (
                                    <ul className="list-disc pl-5 py-2">
                                        {item.benefits.map((res, idx) => (
                                            <li className="li-job-item" key={idx}>
                                                {res}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="py-2">{item.benefits}</p>
                                )}
                            </div>

                            {/* RIGHT */}
                            <div className="col-span-12 md:col-span-5">
                                <div className="content-main-right w-full">
                                    <div className="item-department w-full">
                                        <div className="flex items-center gap-2 font-bold text-xl">
                                            <RiMoneyDollarBoxFill color="green" /> {item.salary}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaLocationDot size={14} color="green" /> {item.location}
                                        </div>
                                        <span className="department-item-name">
                                            <MdApartment color="green" /> {item.department.name}
                                        </span>
                                        <span className="department-item-name">
                                            <BiSolidTimer color="green" /> {item.workingHours}
                                        </span>
                                        <span className="text-black flex items-center gap-2">
                                            <AiFillClockCircle color="green" /> chỉnh sửa{" "}
                                            {getTimeAgo(item.createAt!, item.updatedAt!)}
                                        </span>

                                        <div className="flex gap-5 items-center flex-wrap pt-2">

                                            <button
                                                type="button"
                                                className={`button-apply btn ${applyted ? "applied" : ""}`}
                                                // onClick={!applyted ? applyJob : applyJob}
                                                // disabled={applyted}
                                                onClick={applyJob}
                                            >
                                                {applyted ? "Đã ứng tuyển" : "Ứng tuyển"}
                                            </button>

                                            <button
                                                type="button"
                                                className={`button-save btn ${saved ? "saved" : ""}`}
                                                onClick={toggleSave}
                                            >
                                                {saved ? "Đã lưu" : "Lưu bài đăng"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="content-main-bottom w-full">
                    <h3 className="content-title">Địa điểm</h3>
                    <p className="py-2">{item.address}</p>
                    <div className="map w-full">
                        <Map address={item.address + ", " + item.location} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;
