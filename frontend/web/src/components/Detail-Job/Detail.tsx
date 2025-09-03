import React, { useState } from "react";
import "./Detail.css";

import page from "../../assets/images/page-picture.jpg";

import { FaLocationDot } from 'react-icons/fa6';
import { RiMoneyDollarBoxFill } from 'react-icons/ri';

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
                <img className="avt-department" src={item.image} />
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-left title-job">{item.nameJob}</span>
                        <a className="text-left text-gray-600" href={`/department/${item.department}`}
                            style={{ fontSize: 18 }}
                        >
                            {item.department} • chỉnh sửa {getTimeAgo(item.postedAt!, item.updatedAt!)}
                        </a>
                    </div>

                    <div className="flex gap-10 items-center">
                        <div>
                            <div className="flex items-center gap-2"><FaLocationDot size={14} color="green" /> {item.location}</div>
                            <div className="flex items-center gap-2 font-bold"
                                style={{ fontSize: 20 }}
                            ><RiMoneyDollarBoxFill color="green" /> {item.salary}</div>
                        </div>
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

                    </div>
                </div>

            </div>

            <div className="page-content text-left">
                <h3 className="content-title">Về công việc này</h3>
                <p style={{ paddingTop: 10, paddingBottom: 10 }}>{item.about}</p>

                <h3 className="content-title">Hình thức làm việc</h3>
                <p style={{ paddingTop: 10, paddingBottom: 10 }}>{item.type}</p>

                <h3 className="content-title">Trách nhiệm</h3>
                {Array.isArray(item.responsibilities) ? (
                    <ul style={{ paddingTop: 10, paddingBottom: 10, listStyle: "disc", paddingLeft: 20 }}>
                        {item.responsibilities.map((res: string, idx: number) => (
                            <li key={idx}>{res}</li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ paddingTop: 10, paddingBottom: 10 }}>{item.responsibilities}</p>
                )}

                <h3 className="content-title">Yêu cầu</h3>
                {Array.isArray(item.requirements) ? (
                    <ul style={{ paddingTop: 10, paddingBottom: 10, listStyle: "disc", paddingLeft: 20 }}>
                        {item.requirements.map((req: string, idx: number) => (
                            <li key={idx}>{req}</li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ paddingTop: 10, paddingBottom: 10 }}>{item.requirements}</p>
                )}

                <h3 className="content-title">Phúc lợi</h3>
                {Array.isArray(item.benefits) ? (
                    <ul style={{ paddingTop: 10, paddingBottom: 10, listStyle: "disc", paddingLeft: 20 }}>
                        {item.requirements.map((req: string, idx: number) => (
                            <li key={idx}>{req}</li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ paddingTop: 10, paddingBottom: 10 }}>{item.benefits}</p>
                )}

                <h3 className="content-title">Thời gian làm việc</h3>
                <p style={{ paddingTop: 10, paddingBottom: 10 }}>{item.workingHours}</p>

            </div>


        </div>
    );
};

export default Detail;