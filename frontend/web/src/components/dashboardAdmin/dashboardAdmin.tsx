import { Fa42Group } from "react-icons/fa6";
import "../dashboardAdmin/DashboardAdmin.css";
import { FaAccusoft, FaForumbee } from "react-icons/fa";
import { useEffect, useState } from "react";

import SalaryJobChart from "./SalaryJobChart";
import HotIndustryChart from "./HotIndustryChart";
import useDashboardAdmin from "../../hook/useDashboardAdmin";
import useDashboardCharts from "../../hook/useDashboardCharts";
import PostAdmin from "./Post";
import { ConfigProvider, DatePicker, Space } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import useJob from "../../hook/useJob";
import useDepartment from "../../hook/useDepartment";

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

interface DashboardContentProps {
  page:
    | "dashboard"
    | "post"
    | "company"
    | "manageUsers"
    | "manageHR"
    | "userTerms"
    | "hrTerms"
    | "about";
  setPage: React.Dispatch<
    React.SetStateAction<
      | "dashboard"
      | "post"
      | "company"
      | "manageUsers"
      | "manageHR"
      | "userTerms"
      | "hrTerms"
      | "about"
    >
  >;
}
const DashboardContent = ({ page, setPage }: DashboardContentProps) => {
  // const [page, setPage] = useState<"dashboard" | "post">("dashboard");
  const [activeCard, setActiveCard] = useState<
    "pendingPosts" | "departments" | null
  >(null); // highlight
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { salaryStats, industryStats, fetchChartData } = useDashboardCharts();
  const { getPendingCount } = useJob();
  const [pendingPosts, setPendingPosts] = useState(0);
  const { departments, loading: loadingDepartments } = useDepartment("all");
  const totalDepartments = departments.length;

  useEffect(() => {
    fetchChartData();
    getPendingCount().then(setPendingPosts);
  }, []);

  const handleRangeChange = (
    dates: RangeValue,
    dateStrings: [string, string]
  ) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  useEffect(() => {
    const today = dayjs();
    const priorDate = dayjs().subtract(30, "day");
    setEndDate(today);
    setStartDate(priorDate);
  }, []);

  const handleCardClick = (card: "pendingPosts" | "departments") => {
    setActiveCard(card);
    if (card === "pendingPosts") setPage("post");
    else if (card === "departments") setPage("company");
  };

  return (
    <>
      {page === "dashboard" ? (
        <div className="admin-app-dashboard">
          <div className="admin-wrapper-dashboard flex flex-col gap-3.5">
            <header className="admin-wrapper-dashboard_head flex items-center justify-between bg-white rounded-xl shadow-2xl">
              <span className="text-xl font-semibold">
                Bảng điều khiển Quản trị
              </span>

              <div className="flex gap-3.5">
                <ConfigProvider
                  theme={{
                    components: {
                      DatePicker: {
                        colorPrimary: "#059669",
                        activeBorderColor: "#059669",
                        hoverBorderColor: "#059669",
                      },
                    },
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

            <div className="admin-wrapper-dashboard_body flex flex-col gap-5">
              <div className="admin-dashboard-body_head grid grid-cols-3 gap-6">
                {/* Tổng số bài đăng */}
                <div
                  className={`relative group cursor-pointer ${
                    activeCard === "pendingPosts"
                      ? "border-2 border-indigo-500"
                      : ""
                  }`}
                  onClick={() => handleCardClick("pendingPosts")}
                >
                  <div className="admin-body-head_card bg-purple-200 justify-center shadow-xl flex p-4 rounded-xl">
                    <div className="text-left flex flex-col gap-2.5 w-4/5">
                      <FaForumbee size={28} />
                      <span className="text-ms font-medium">
                        Tổng số bài đăng đang chờ duyệt
                      </span>
                    </div>
                    <div className="flex flex-col justify-end items-end">
                      <span className="text-3xl font-bold">{pendingPosts}</span>
                    </div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute tool-card invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2">
                    <div
                      className="relative p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]"
                      style={{ padding: 10, textAlign: "justify" }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20">
                          <FaForumbee className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-white">
                          Chi tiết
                        </h3>
                      </div>
                      <p className="text-sm text-gray-300">
                        Đây là tooltip hiển thị thông tin chi tiết về Tổng số
                        bài đăng đang chờ được duyệt
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
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
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50"></div>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-r border-b border-white/10"></div>
                    </div>
                  </div>
                </div>

                {/* Tổng số công ty */}
                <div
                  className={`relative group cursor-pointer ${
                    activeCard === "departments"
                      ? "border-2 border-green-500"
                      : ""
                  }`}
                  onClick={() => handleCardClick("departments")}
                >
                  <div className="admin-body-head_card bg-green-200 justify-center shadow-xl flex p-4 rounded-xl">
                    <div className="text-left flex flex-col gap-2.5 w-4/5">
                      <Fa42Group size={28} />
                      <span className="text-ms font-medium">
                        Tổng số công ty
                      </span>
                    </div>
                    <div className="flex flex-col justify-end items-end">
                      <span className="text-3xl font-bold">
                        {loadingDepartments ? "..." : totalDepartments}
                      </span>
                    </div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute tool-card invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2">
                    <div
                      className="relative p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]"
                      style={{ padding: 10, textAlign: "justify" }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20">
                          <FaForumbee className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-white">
                          Chi tiết
                        </h3>
                      </div>
                      <p className="text-sm text-gray-300">
                        Đây là tooltip hiển thị thông tin chi tiết về Tổng số
                        lượng công ty.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
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
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50"></div>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-r border-b border-white/10"></div>
                    </div>
                  </div>
                </div>

                {/* Bạn vẫn giữ phần Tổng số công việc nếu muốn */}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-5">
            <SalaryJobChart data={salaryStats} />
            <HotIndustryChart data={industryStats} />
          </div>
        </div>
      ) : (
        <div className="min-h-screen p-4 bg-gray-50">
          <PostAdmin />
        </div>
      )}
    </>
  );
};

export default DashboardContent;
