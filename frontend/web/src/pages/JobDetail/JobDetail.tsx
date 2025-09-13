import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './JobDetails.css';
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import { useNavigate } from "react-router-dom";
import { fetchProvinces, type Province } from "../../utils/provinceApi";
import { BsFilter } from 'react-icons/bs';
import Detail from "../../components/Detail-Job/Detail";
import useJob from "../../hook/useJob";

const JobDetails: React.FC = () => {

    const [jobTitle, setJobTitle] = useState("");
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [location, setLocation] = useState("");
    const { id } = useParams<{ id: string }>();
    const { joblatest } = useJob();
    const selectedJob = joblatest.find(job => job._id === id);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProvinces().then(setProvinces);
        window.scrollTo(0, 0);
    }, [id]);

    const handleSearch = () => {
        alert(`Tìm kiếm: ${jobTitle} tại ${location}`);
    };

    const getTimeAgo = (postedAt: string, updatedAt?: string): string => {
        const date = new Date(updatedAt || postedAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) {
            return "Vừa xong";
        } else if (diffMinutes < 60) {
            return `${diffMinutes} phút trước`;
        } else if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        } else {
            return `${diffDays} ngày trước`;
        }
    };

    const handlerJobItem = (id: string) => {
        navigate(`/jobdetail/${id}`);
    };

    return (
        <>
            <div className="App-JobDetail">
                <Header />
                <ChatWithAI />

                <div className="content bg-gray-50">

                    <div className="content-main flex flex-wrap xl:flex-nowrap flex-col gap-5">

                        <div className="content-main-header bg-white w-full flex gap-5">
                            {/* Combobox Vị trí tuyển dụng */}
                            <select
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className="w-full xl:w-2/6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">Chọn vị trí tuyển dụng</option>
                                <option value="intern frontend">Intern Frontend</option>
                                <option value="intern backend">Intern Backend</option>
                                <option value="intern designer">Intern UI/UX Designer</option>
                            </select>

                            {/* Combobox Địa điểm */}
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full xl:w-2/6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">Chọn địa điểm</option>
                                {provinces.map((p) => (
                                    <option key={p.code} value={p.name}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            {/* Nút tìm kiếm */}
                            <button
                                onClick={handleSearch}
                                className="btn-searchjob w-full xl:w-2/6 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition p-2"
                            >
                                Tìm kiếm
                            </button>
                        </div>

                        <div className="content-main-center grid grid-cols-1 md:grid-cols-9 lg:grid-cols-9 gap-2 w-full">

                            <div className="lg:col-span-3 md:col-span-3">
                                <div className="head-card head-left gap-5">

                                    <div className="head-left-top flex w-full">
                                        <p>Có liên quan</p>
                                        <button className="btn-filter flex items-center">
                                            <BsFilter />
                                            Fillters
                                        </button>
                                    </div>

                                    <div className="head-left-main flex flex-col w-full">
                                        {joblatest.map((item) => (
                                            <div
                                                key={item._id}
                                                className={`job-item flex items-center gap-5 cursor-pointer`}
                                                onClick={() => handlerJobItem(item._id.toString())}
                                            >
                                                <div className="bg-gray-200"
                                                    style={{ borderRadius: 5, padding: 5 }}
                                                >
                                                    <img className="job-item-image" src={item.department.avatar} />
                                                </div>
                                                <div className="flex flex-col gap-2 text-left flex-2/4">
                                                    <span style={{ fontWeight: 'bold' }}>{item.jobTitle}</span>
                                                    <div className="flex gap-5" style={{fontSize: 15}}>
                                                        <span className="text-gray-500 department-name">{item.department.name}</span>
                                                        {/* <span className="text-gray-500">{getTimeAgo(item.createdAt!, item.updatedAt!)}</span> */}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 text-center flex-1/4">
                                                    <span>{item.jobLevel}</span>
                                                    <span>{item.jobType}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-6 md:col-span-6">
                                <div className="head-card">
                                    {(selectedJob || joblatest[0]) ? (
                                        <Detail item={selectedJob || joblatest[0]} />
                                    ) : (
                                        <p className="text-gray-500">Hãy chọn 1 công việc để xem chi tiết</p>
                                    )}

                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                <Footer />
            </div>
        </>
    );
}

export default JobDetails;