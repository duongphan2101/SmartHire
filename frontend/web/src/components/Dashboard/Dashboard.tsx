import { Fa42Group } from "react-icons/fa6";
import "./Dashboard.css";

import { FaAccusoft, FaForumbee, FaLinux } from 'react-icons/fa';
// import AreaBaseline from "./AreaBaseLine";
import PieChart from "./PieChart";
import { useEffect, useState } from "react";
import useDashboard from "../../hook/useDashboard";
import { Badge, ConfigProvider, DatePicker, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from "dayjs";
import ListCandidate from "./ListCandidate";
import useApplication, { type ApplicationResponse } from "../../hook/useApplication";
import ViewModal from "../dashboard-hr/Viewmodal";
import type { ChatRoom } from "../../utils/interfaces";
import useJob from "../../hook/useJob";
// import Calendar_Das from "./Calendar";
import Calendar_FC from "./Timeline_Calendar";

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;
interface DashboardProps {
    onOpenChatRequest: (room: ChatRoom) => void;
    setBreadcrumb: (breadcrumb: string) => void;
    setPage: (
        page: "dashboard" | "about" | "company" | "jobPost" | "allJobPost" | "payment" | "termHr"
    ) => void;
}
const Dashboard = ({ onOpenChatRequest, setPage, setBreadcrumb }: DashboardProps) => {

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const { allJobDepartment, allJobUser, allCandidate, allCandidateByUser } = useDashboard();
    const { getAllJobByUser } = useApplication();
    const { getJobById } = useJob();
    const [dataFetchApplication, setDataFetchApplication] = useState<ApplicationResponse[]>([]);
    const [userIdFind, setUserIdFind] = useState<string>("");
    const [, setSelectedCandidate] = useState<string>("");
    const [activeuser, setActiveUser] = useState<string>("");
    const { refetch } = useJob();
    const [viewJob, setViewJob] = useState<any | null>(null);

    const handleRangeChange = (dates: RangeValue, dateStrings: [string, string]) => {
        if (dates) {
            setStartDate(dates[0]);
            setEndDate(dates[1]);

            console.log('Start Date (Chuỗi):', dateStrings[0]);
            console.log('End Date (Chuỗi):', dateStrings[1]);
        } else {
            console.log('Đã xóa lựa chọn');
            setStartDate(null);
            setEndDate(null);
        }
    };

    useEffect(() => {
        const end = dayjs();
        const start = end.subtract(30, 'day');
        setEndDate(end);
        setStartDate(start);

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                const id = parsed.user_id ?? parsed._id;
                setUserIdFind(id);
            } catch (error) {
                console.error("Error parsing user", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // Chỉ fetch khi có userId
            if (!userIdFind) return;

            try {
                const startStr = startDate ? startDate.toISOString() : undefined;
                const endStr = endDate ? endDate.toISOString() : undefined;
                const dataFetch = await getAllJobByUser(userIdFind, startStr ?? '', endStr ?? '');
                setDataFetchApplication(dataFetch || []);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchData();
    }, [userIdFind, startDate, endDate]);

    const handleSelectCandidate = async (application: ApplicationResponse) => {
        setSelectedCandidate(application._id);
        setActiveUser(application.userId);
        try {
            if (application.jobId) {
                const jobData = await getJobById(application.jobId);
                setViewJob(jobData);
            } else {
                console.error("Không tìm thấy Job ID trong đơn ứng tuyển này");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin Job:", error);
        }
    }

    const handleItemClick = (item: string, isSubMenu: boolean) => {
        const breadcrumbText = isSubMenu ? `Công việc > ${item}` : item;
        setBreadcrumb(breadcrumbText);
        if (item === "Công ty") setPage("company");
        else if (item === "Bảng điều khiển") setPage("dashboard");
        else if (item === "Công việc đã đăng") setPage("jobPost");
        else if (item === "Tất cả công việc") setPage("allJobPost");
        else if (item === "Điều khoản HR") setPage("termHr");
    };

    return (
        <div className="app-dashboard">
            <div className="wrapper-dashboard flex flex-col gap-3.5">

                <header className="wrapper-dashboard_head flex items-center justify-between bg-white rounded-xl shadow-2xl">
                    <span className="text-xl font-bold">Bảng điều kiển</span>
                    <div className="flex gap-3.5">
                        <ConfigProvider
                            theme={{
                                components: {
                                    DatePicker: {
                                        colorPrimary: '#059669',
                                        activeBorderColor: '#059669',
                                        hoverBorderColor: "#059669"
                                    }
                                }
                            }}
                        >
                            <Space direction="vertical" size={12}>
                                <RangePicker
                                    value={[startDate, endDate]}
                                    onChange={handleRangeChange}
                                />
                            </Space>
                        </ConfigProvider>
                    </div>
                </header>

                <div className="wrapper-dashboard_body flex flex-col gap-5">

                    <div className="dashboard-body_head grid grid-cols-4 gap-6">

                        {/* Card 1 */}
                        <div className="relative group cursor-pointer"
                            onClick={() => handleItemClick("Tất cả công việc", true)}
                        >
                            <div className="body-head_card bg-purple-200 justify-center shadow-xl flex p-4 rounded-xl">
                                <div className="text-left flex flex-col gap-2.5 w-4/5">
                                    <FaForumbee size={38} className="body-head_card_icon" />
                                    <span className="text-3xl font-bold body-head_card_title">Tổng công việc</span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                    <span className="text-5xl font-bold body-head_card_count">
                                        {allJobDepartment > 99 ? "99+" : allJobDepartment}
                                    </span>
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
                        <div className="relative group cursor-pointer"
                            onClick={() => handleItemClick("Công việc đã đăng", true)}
                        >
                            <div className="body-head_card bg-green-200 justify-center shadow-xl flex p-4 rounded-xl">
                                <div className="text-left flex flex-col gap-2.5 w-4/5">
                                    <Fa42Group size={38} className="body-head_card_icon" />
                                    <span className="text-3xl font-bold body-head_card_title">Công việc đã đăng</span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                    <span className="text-5xl font-bold body-head_card_count">
                                        {allJobUser > 99 ? "99+" : allJobUser}
                                    </span>
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
                                    <FaAccusoft size={38} className="body-head_card_icon" />
                                    <span className="text-3xl font-bold body-head_card_title">Tổng ứng viên</span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                    <span className="text-5xl font-bold body-head_card_count">
                                        {allCandidate > 99 ? "99+" : allCandidate}
                                    </span>
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
                                    <FaLinux size={38} className="body-head_card_icon" />
                                    <span className="text-3xl font-bold body-head_card_title">Ứng viên của bạn</span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                    <span className="text-5xl font-bold body-head_card_count">{allCandidateByUser > 99 ? "99+" : allCandidateByUser}</span>
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
                        style={{ marginTop: 20 }}
                    >

                        <div className="body-main_left bg-white w-[65%] shadow-xl rounded-xl">
                            {viewJob && (
                                <ViewModal
                                    job={viewJob}
                                    onClose={() => setViewJob(null)}
                                    onUpdated={refetch}
                                    update={false}
                                    onOpenChatRequest={onOpenChatRequest}
                                    admin={false}
                                    activeUser={activeuser}
                                />
                            )}
                            {/*  <BarChart />*/}
                            <div className="flex items-center justify-between">
                                <h3 className="text-left text-2xl font-bold list_candidate_title"
                                    style={{ paddingBottom: 10, paddingLeft: 20 }}
                                >
                                    Danh sách ứng viên ứng tuyển từ ngày {startDate?.format('YYYY-MM-DD') ?? '-'} đến ngày {endDate?.format('YYYY-MM-DD') ?? '-'}

                                </h3>
                                <Badge
                                    className="site-badge-count-99"
                                    count={"Tổng: " + dataFetchApplication.length}
                                    style={{ backgroundColor: '#059669', marginRight: 20 }}
                                />
                            </div>
                            <ListCandidate dataList={dataFetchApplication} onSelect={handleSelectCandidate} />
                        </div>

                        <div className="body-main_right w-[35%] bg-gra-50 flex flex-col gap-5"
                            style={{ position: 'relative' }}
                        >
                            <div className="shadow-xl rounded-xl">
                                <PieChart hrId={userIdFind} />
                            </div>
                            {/* <div className="shadow-xl rounded-xl">
                                <AreaBaseline />
                            </div> */}
                        </div>

                    </div>

                    <div className="body-main-bottom bg-white shadow-2xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <h4 className="text-xl font-bold"
                                style={{ paddingLeft: 10, marginBottom: 10, marginTop: 10 }}
                            >Các cuộc phỏng vấn đã sắp xếp
                            </h4>

                            <div className="flex flex-wrap gap-4 text-sm" style={{ paddingRight: '10px' }}>
                                <Badge status="processing" text="Đã xác nhận" /> {/* Confirmed - Xanh dương */}
                                <Badge status="warning" text="Chờ xử lý" />      {/* Pending - Vàng */}
                                <Badge status="success" text="Hoàn thành" />     {/* Completed - Xanh lá */}
                                <Badge status="error" text="Thất bại/Hủy" />     {/* Rejected/Failed - Đỏ */}
                                <Badge status="default" text="Hết hạn" />
                            </div>
                        </div>
                        {/* <Calendar_Das /> */}
                        <div style={{ padding: '10px' }}>
                            <Calendar_FC />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Dashboard;