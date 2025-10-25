import { Fa42Group } from "react-icons/fa6";
import "./Dashboard.css";

import { FaAccusoft, FaForumbee, FaLinux } from 'react-icons/fa';
import AreaBaseline from "./AreaBaseLine";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import { useEffect, useState } from "react";

import useDashboard from "../../hook/useDashboard";

const Dashboard = () => {

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const { allJobDepartment, allJobUser, allCandidate, allCandidateByUser } = useDashboard();

    useEffect(() => {
        const today = new Date();
        const priorDate = new Date();
        priorDate.setDate(today.getDate() - 30);

        // format yyyy-mm-dd để input type="date" hiểu
        const formatDate = (date: Date) => {
            return date.toISOString().split("T")[0];
        };

        setEndDate(formatDate(today));
        setStartDate(formatDate(priorDate));
    }, []);

    return (
        <div className="app-dashboard">
            <div className="wrapper-dashboard flex flex-col gap-3.5">

                <header className="wrapper-dashboard_head flex items-center justify-between bg-white rounded-xl shadow-2xl">
                    <span className="text-xl">Bảng điều kiển</span>
                    <div className="flex gap-3.5">
                        <input
                            type="date"
                            className="focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />

                        <input
                            type="date"
                            className="focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </header>

                <div className="wrapper-dashboard_body flex flex-col gap-5">

                    <div className="dashboard-body_head grid grid-cols-4 gap-6">

                        {/* Card 1 */}
                        <div className="relative group cursor-pointer">
                            <div className="body-head_card bg-purple-200 justify-center shadow-xl flex p-4 rounded-xl">
                                <div className="text-left flex flex-col gap-2.5 w-4/5">
                                    <FaForumbee size={28} />
                                    <span className="text-ms">Tổng công việc</span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                    <span className="text-3xl font-bold">{allJobDepartment}</span>
                                </div>
                            </div>

                            {/* Tooltip */}
                            <div className="absolute tool-card invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2">
                                <div className="relative p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]"
                                    style={{ padding: 10, textAlign: 'justify' }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20">
                                            <FaForumbee className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-white">Chi tiết</h3>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        Đây là tooltip hiển thị thông tin chi tiết về Tổng công việc.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 
                                                01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
                                                12.586l7.293-7.293a1 1 0 011.414 0z"
                                            ></path>
                                        </svg>
                                        <span>Premium Feature</span>
                                    </div>

                                    {/* Glow background */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50"></div>
                                    {/* Arrow */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-r border-b border-white/10"></div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="relative group cursor-pointer">
                            <div className="body-head_card bg-green-200 justify-center shadow-xl flex p-4 rounded-xl">
                                <div className="text-left flex flex-col gap-2.5 w-4/5">
                                    <Fa42Group size={28} />
                                    <span className="text-ms">Công việc đã đăng</span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                    <span className="text-3xl font-bold">{allJobUser}</span>
                                </div>
                            </div>

                            {/* Tooltip */}
                            <div className="absolute tool-card invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2">
                                <div className="relative p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]"
                                    style={{ padding: 10, textAlign: 'justify' }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20">
                                            <Fa42Group className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-white">Chi tiết</h3>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        Đây là tooltip hiển thị thông tin chi tiết về Tổng công việc.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 
                                                01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
                                                12.586l7.293-7.293a1 1 0 011.414 0z"
                                            ></path>
                                        </svg>
                                        <span>Premium Feature</span>
                                    </div>

                                    {/* Glow background */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50"></div>
                                    {/* Arrow */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-r border-b border-white/10"></div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="relative group cursor-pointer">
                            <div className="body-head_card bg-blue-200 justify-center shadow-xl flex p-4 rounded-xl">
                                <div className="text-left flex flex-col gap-2.5 w-4/5">
                                    <FaAccusoft size={28} />
                                    <span className="text-ms">Tổng ứng viên</span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                    <span className="text-3xl font-bold">{allCandidate}</span>
                                </div>
                            </div>

                            {/* Tooltip */}
                            <div className="absolute tool-card invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2">
                                <div className="relative p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]"
                                    style={{ padding: 10, textAlign: 'justify' }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20">
                                            <FaAccusoft className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-white">Chi tiết</h3>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        Đây là tooltip hiển thị thông tin chi tiết về Tổng công việc.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 
                                                01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
                                                12.586l7.293-7.293a1 1 0 011.414 0z"
                                            ></path>
                                        </svg>
                                        <span>Premium Feature</span>
                                    </div>

                                    {/* Glow background */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50"></div>
                                    {/* Arrow */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-r border-b border-white/10"></div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="relative group cursor-pointer">
                            <div className="body-head_card bg-red-200 justify-center shadow-xl flex p-4 rounded-xl">
                                <div className="text-left flex flex-col gap-2.5 w-4/5">
                                    <FaLinux size={28} />
                                    <span className="text-ms">Ứng viên của bạn</span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                    <span className="text-3xl font-bold">{allCandidateByUser}</span>
                                </div>
                            </div>

                            {/* Tooltip */}
                            <div className="absolute tool-card invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2">
                                <div className="relative p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]"
                                    style={{ padding: 10, textAlign: 'justify' }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20">
                                            <FaLinux className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-white">Chi tiết</h3>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        Đây là tooltip hiển thị thông tin chi tiết về Tổng công việc.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 
                                                01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
                                                12.586l7.293-7.293a1 1 0 011.414 0z"
                                            ></path>
                                        </svg>
                                        <span>Premium Feature</span>
                                    </div>

                                    {/* Glow background */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50"></div>
                                    {/* Arrow */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-r border-b border-white/10"></div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="dashboard-body_main flex gap-5"
                        style={{marginTop: 20}}
                    >

                        <div className="body-main_left w-[65%] shadow-xl rounded-xl">
                            <BarChart />
                        </div>

                        <div className="body-main_right w-[35%] bg-gray-50 flex flex-col gap-5"
                            style={{ position: 'relative' }}
                        >
                            <div className="shadow-xl rounded-xl">
                                <PieChart />
                            </div>
                            <div className="shadow-xl rounded-xl">
                                <AreaBaseline />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;