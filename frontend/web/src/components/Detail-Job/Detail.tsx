import React, { useState } from "react";
import "./Detail.css";

import page from "../../assets/images/page-picture.jpg";
import Map from "../Map/Map";

import { FaLocationDot } from 'react-icons/fa6';
import { RiMoneyDollarBoxFill } from 'react-icons/ri';
import { MdApartment } from 'react-icons/md';
import { AiFillClockCircle } from 'react-icons/ai';

interface DetailProps {
    item: any;
}

const Detail: React.FC<DetailProps> = ({ item }) => {

    const [saved, setSaved] = useState(item.isSaved);

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

    return (
        <div className="detail-container w-full">

            <div className="page-picture">
                <img className="bg-picture" src={page} alt="page-picture" />
            </div>

            <div className="page-title w-full flex flex-col gap-3">
                <img className="avt-department" src={item.department.avatar} />
                <div className="flex items-center">
                    <div className="flex flex-col">
                        <span className="text-left title-job">{item.jobTitle}</span>
                        <a className="text-left text-gray-600" href={`/department/${item.department}`}
                            style={{ fontSize: 18 }}
                        >
                            <span className="department-item-name">{item.department.name}</span>
                        </a>
                    </div>

                    {/* <div className="flex gap-10 items-center">
                        <div className="flex gap-3 items-center flex-wrap">

                            <button
                                type="button"
                                className={`button-save btn ${saved ? "saved" : ""}`}
                                onClick={() => setSaved(!saved)}
                            >
                                {saved ? "Đã lưu" : "Lưu bài đăng"}
                            </button>

                            <button type="button" className="button-apply btn"
                                onClick={() => { alert("OK") }}
                            >
                                Ứng tuyển
                            </button>

                        </div>

                    </div> */}
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
                                        {item.jobDescription.map((res: string, idx: number) => (
                                            <li className="li-job-item" key={idx}>{res}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="py-2">{item.jobDescription}</p>
                                )}

                                <h3 className="content-title">Hình thức làm việc</h3>
                                <p className="py-2" style={{ paddingLeft: 15 }}>{item.jobType}</p>

                                <h3 className="content-title">Trách nhiệm chính</h3>
                                {Array.isArray(item.requirement) ? (
                                    <ul className="list-disc pl-5 py-2">
                                        {item.requirement.map((res: string, idx: number) => (
                                            <li className="li-job-item" key={idx}>{res}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="py-2">{item.requirement}</p>
                                )}

                                <h3 className="content-title">Kỹ năng cần có</h3>
                                {Array.isArray(item.skills) ? (
                                    <ul className="list-disc pl-5 py-2">
                                        {item.skills.map((req: string, idx: number) => (
                                            <li className="li-job-item" key={idx}>{req}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="py-2">{item.skills}</p>
                                )}

                                <h3 className="content-title">Phúc lợi</h3>
                                {Array.isArray(item.benefits) ? (
                                    <ul className="list-disc pl-5 py-2">
                                        {item.benefits.map((req: string, idx: number) => (
                                            <li className="li-job-item" key={idx}>{req}</li>
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

                                        <div className="flex items-center gap-2 font-bold"
                                            style={{ fontSize: 20 }}
                                        ><RiMoneyDollarBoxFill color="green" /> {item.salary}</div>
                                        <div className="flex items-center gap-2"><FaLocationDot size={14} color="green" /> {item.location}</div>
                                        <span className="department-item-name"><MdApartment color="green" />{item.department.name}</span>
                                        <span className="text-black flex items-center gap-2"><AiFillClockCircle color="green" /> chỉnh sửa {getTimeAgo(item.createAt!, item.updatedAt!)}</span>
                                        
                                        <div className="flex gap-5 items-center flex-wrap" style={{paddingTop: 10}}>

                                            <button type="button" className="button-apply btn"
                                                onClick={() => { alert("OK") }}
                                            >
                                                Ứng tuyển
                                            </button>

                                            
                                            <button
                                                type="button"
                                                className={`button-save btn ${saved ? "saved" : ""}`}
                                                onClick={() => setSaved(!saved)}
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

                <div className="content-main-bottom w-full">
                    <h3 className="content-title">Địa điểm</h3>
                    <p style={{ paddingTop: 10, paddingBottom: 10 }}>{item.address}</p>
                    <div className="map w-full">
                        <Map address={item.address} />
                    </div>
                </div>

            </div>


        </div>
    );
};

export default Detail;