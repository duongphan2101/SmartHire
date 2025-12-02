import { Fa42Group } from "react-icons/fa6";
import "../dashboardAdmin/DashboardAdmin.css";
import { FaForumbee, FaUserSlash } from "react-icons/fa";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Spin, Alert, Empty, Tag, Table } from "antd";
import { ConfigProvider, DatePicker, Space } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import useDashboardCharts from "../../hook/useDashboardCharts";
import PostAdmin from "./Post";
import useJob, { type Job } from "../../hook/useJob";
import useDepartment ,{type DepartmentData} from "../../hook/useDepartment";
import useUser from "../../hook/useUser";

import axios from "axios";
import { HOSTS } from "../../utils/host";
import ViewModal from "../../components/dashboard-hr/Viewmodal";
import ModalViewCompany from "../../components/dashboard-hr/ModalViewCompany"; 

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
  setPage: React.Dispatch<any>;
}

const PendingJobWidget: React.FC<{
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onJobClick?: (job: Job) => void;
}> = ({ startDate, endDate, onJobClick }) => {
  const { pendingJobsAdmin, loading, error, fetchPendingJobsAdmin } = useJob();
  const [isLoadingWidget, setIsLoadingWidget] = useState(true);

  const loadPendingJobs = useCallback(async () => {
    setIsLoadingWidget(true);
    await fetchPendingJobsAdmin();
    setIsLoadingWidget(false);
  }, [fetchPendingJobsAdmin]);

  useEffect(() => {
    loadPendingJobs();
  }, [loadPendingJobs]);

  const filteredJobs = useMemo(() => {
    let data = pendingJobsAdmin;

    if (startDate && endDate) {
      data = data.filter((job) => {
        const jobDate = dayjs(job.createdAt);
        return (
          jobDate.isAfter(startDate.startOf("day")) &&
          jobDate.isBefore(endDate.endOf("day").add(1, "day"))
        );
      });
    }
    return data;
  }, [pendingJobsAdmin, startDate, endDate]);

  const columns = [
    {
      title: "Bài đăng",
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (text: string) => (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ),
    },
    { title: "Công ty", dataIndex: ["department", "name"], key: "department" },
    {
      title: "Người đăng",
      dataIndex: ["createBy", "fullname"],
      key: "createBy",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => <Tag color="orange">Chờ duyệt</Tag>,
    },
  ];

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error || "Không thể tải danh sách bài đăng chờ duyệt"}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="admin-dashboard-body_main bg-white shadow-2xl rounded-xl">
      <h3 className="text-left text-xl font-bold py-4 px-6 border-b list_candidate_title_admin">
        Danh sách bài đăng đang chờ duyệt từ ngày{" "}
        {startDate?.format("YYYY-MM-DD") ?? "-"} đến ngày{" "}
        {endDate?.format("YYYY-MM-DD") ?? "-"}
      </h3>

      {isLoadingWidget || loading ? (
        <div className="p-10 text-center">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-10">
          <Empty description="Không có bài đăng nào đang chờ duyệt." />
        </div>
      ) : (
        <div className="p-4 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredJobs.slice(0, 5)}
            rowKey="_id"
            pagination={false}
            size="small"
            onRow={(record) => ({
              onClick: () => onJobClick?.(record),
              className: "cursor-pointer hover:bg-blue-50",
            })}
          />
        </div>
      )}
    </div>
  );
};

const PendingCompanyWidget: React.FC<{
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onCompanyClick?: (company: DepartmentData) => void;
}> = ({ startDate, endDate, onCompanyClick }) => {
  const { departments, error, fetchPendingDepartmentsAdmin, loading } =
    useDepartment("all");
  const [isLoadingWidget, setIsLoadingWidget] = useState(true);

  const loadPendingCompanies = useCallback(async () => {
    setIsLoadingWidget(true);
    await fetchPendingDepartmentsAdmin?.();
    setIsLoadingWidget(false);
  }, [fetchPendingDepartmentsAdmin]);

  useEffect(() => {
    loadPendingCompanies();
  }, [loadPendingCompanies]);

  const filteredCompanies = useMemo(() => {
    let data = departments.filter((dep) => dep.status === "Pending");

    if (startDate && endDate) {
      data = data.filter((dep) => {
        const depDate = dayjs(dep.createdAt);
        return (
          depDate.isAfter(startDate.startOf("day")) &&
          depDate.isBefore(endDate.endOf("day").add(1, "day"))
        );
      });
    }
    return data;
  }, [departments, startDate, endDate]);

  const columns = [
    {
      title: "Tên Công ty",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ),
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => <Tag color="orange">Chờ duyệt</Tag>,
    },
  ];

  if (error) {
    return (
      <Alert
        message="Lỗi tải công ty"
        description={error || "Không thể tải danh sách công ty chờ duyệt"}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="admin-dashboard-body_main bg-white shadow-2xl rounded-xl">
      <h3 className="text-left text-xl font-bold py-4 px-6 border-b list_candidate_title">
        Danh sách công ty đang chờ duyệt từ ngày{" "}
        {startDate?.format("YYYY-MM-DD") ?? "-"} đến ngày{" "}
        {endDate?.format("YYYY-MM-DD") ?? "-"}
      </h3>

      {isLoadingWidget || loading ? (
        <div className="p-10 text-center">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="p-10">
          <Empty description="Không có công ty nào đang chờ duyệt." />
        </div>
      ) : (
        <div className="p-4 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredCompanies.slice(0, 5)}
            rowKey="_id"
            pagination={false}
            size="small"
            onRow={(record) => ({
              onClick: () => onCompanyClick?.(record),
              className: "cursor-pointer hover:bg-blue-50",
            })}
          />
        </div>
      )}
    </div>
  );
};

const PendingReportWidget: React.FC<{
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}> = ({ startDate, endDate }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingWidget, setIsLoadingWidget] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoadingWidget(true);
      setLoading(true);

      const res = await axios.get(`${HOSTS.reportService}/admin/reports`);
      setReports(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không tải được báo cáo");
    } finally {
      setLoading(false);
      setIsLoadingWidget(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = useMemo(() => {
    let data = reports;
    if (startDate && endDate) {
      data = data.filter((r) => {
        const reportDate = dayjs(r.createdAt);
        return (
          reportDate.isAfter(startDate.startOf("day")) &&
          reportDate.isBefore(endDate.endOf("day").add(1, "day"))
        );
      });
    }
    return data;
  }, [reports, startDate, endDate]);

  const columns = [
    {
      title: "Lý do",
      dataIndex: "title",
      key: "title",
      render: (reason: string) => <Tag color="orange">{reason || "Khác"}</Tag>,
    },
    {
      title: "Bài đăng",
      key: "job",
      render: (_: any, record: any) =>
        record.jobId ? (
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            {record.jobTitle || "Xem bài đăng"}
          </a>
        ) : (
          <span className="text-gray-500">Không có bài đăng</span>
        ),
    },
    {
      title: "Người báo cáo",
      dataIndex: ["userId", "fullname"],
      key: "reporter",
      render: (fullname: string) => fullname || "Ẩn danh",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Nội dung",
      dataIndex: "details",
      key: "details",
      width: 280,
      render: (text: string) => (
        <div
          className="max-w-full whitespace-normal break-words text-sm leading-relaxed"
          title={text}
        >
          {text || (
            <span className="text-gray-400 italic">Không có nội dung</span>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <Alert
        message="Lỗi tải báo cáo"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="admin-dashboard-body_main bg-white shadow-2xl rounded-xl">
      <h3 className="text-left text-xl font-bold py-4 px-6 border-b list_candidate_title_admin">
        Danh sách báo cáo từ người dùng
      </h3>

      {isLoadingWidget || loading ? (
        <div className="p-10 text-center">
          <Spin size="large" tip="Đang tải báo cáo..." />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="p-10">
          <Empty description="Không có báo cáo nào." />
        </div>
      ) : (
        <div className="p-4 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredReports.slice(0, 5)}
            rowKey="_id"
            pagination={false}
            size="small"
          />
        </div>
      )}
    </div>
  );
};

const DashboardContent: React.FC<DashboardContentProps> = ({
  page,
  setPage,
}) => {
  const [activeCard, setActiveCard] = useState<
    "pendingPosts" | "departments" | "bannedUsers" | null
  >(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const { fetchChartData } = useDashboardCharts();
  const { totalJobsCount, loading: jobLoading } = useJob();
  const { departments } = useDepartment("all");
  const { getBannedUsersCount } = useUser();
  const [bannedUsers, setBannedUsers] = useState(0);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<DepartmentData | null>(
    null
  );
  const openCompanyModal = (company: DepartmentData) => {
    setSelectedCompany(company);
  };

  const closeCompanyModal = () => {
    setSelectedCompany(null);
  };

  const openJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeJobModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  useEffect(() => {
    fetchChartData();
    getBannedUsersCount().then((count) => {
      if (count !== undefined && count !== null) {
        setBannedUsers(count);
      }
    });
  }, [fetchChartData, getBannedUsersCount]);

  useEffect(() => {
    const today = dayjs();
    setStartDate(today.subtract(30, "day"));
    setEndDate(today);
  }, []);

  const handleRangeChange = (dates: RangeValue) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleCardClick = (
    card: "pendingPosts" | "departments" | "bannedUsers"
  ) => {
    setActiveCard(card);
    if (card === "pendingPosts") setPage("post");
    else if (card === "departments") setPage("company");
    else if (card === "bannedUsers") setPage("manageUsers");
  };

  // const totalJobsCount = totalJobsCount.length;
  const totalDepartments = departments.length;

  return (
    <>
      {page === "dashboard" ? (
        <div className="admin-app-dashboard">
          <div className="admin-wrapper-dashboard flex flex-col gap-3.5">
            <header className="admin-wrapper-dashboard_head flex items-center justify-between bg-white rounded-xl shadow-2xl p-4">
              <span className="text-xl font-semibold">
                Bảng điều khiển Quản trị
              </span>
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
            </header>

            <div className="admin-dashboard-body_head grid grid-cols-1 md:grid-cols-3 gap-6">
              {/*  Bài đăng chờ duyệt */}
              <div
                className={`relative group cursor-pointer transition-all ${
                  activeCard === "pendingPosts" ? "ring-4 ring-indigo-500" : ""
                }`}
                onClick={() => handleCardClick("pendingPosts")}
              >
                <div className="admin-body-head_card bg-purple-200 shadow-xl flex p-6 rounded-xl hover:shadow-2xl transition-shadow">
                  <div className="text-left flex flex-col gap-3 w-4/5">
                    <FaForumbee size={32} className="text-purple-700" />
                    <span className="font-medium">
                      Tổng số bài đăng đang chờ duyệt
                    </span>
                  </div>
                  <div className="flex items-end justify-end">
                    <span className="text-4xl font-bold text-purple-900">
                      {totalJobsCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tổng công ty */}
              <div
                className={`relative group cursor-pointer transition-all ${
                  activeCard === "departments" ? "ring-4 ring-green-500" : ""
                }`}
                onClick={() => handleCardClick("departments")}
              >
                <div className="admin-body-head_card bg-green-200 shadow-xl flex p-6 rounded-xl hover:shadow-2xl transition-shadow">
                  <div className="text-left flex flex-col gap-3 w-4/5">
                    <Fa42Group size={32} className="text-green-700" />
                    <span className="font-medium">Tổng số công ty</span>
                  </div>
                  <div className="flex items-end justify-end">
                    <span className="text-4xl font-bold text-green-900">
                      {totalDepartments}
                    </span>
                  </div>
                </div>
              </div>

              {/* Người dùng bị cấm */}
              <div
                className={`relative group cursor-pointer transition-all ${
                  activeCard === "bannedUsers" ? "ring-4 ring-red-500" : ""
                }`}
                onClick={() => handleCardClick("bannedUsers")}
              >
                <div className="admin-body-head_card bg-red-200 shadow-xl flex p-6 rounded-xl hover:shadow-2xl transition-shadow">
                  <div className="text-left flex flex-col gap-3 w-4/5">
                    <FaUserSlash size={32} className="text-red-700" />
                    <span className="font-medium">
                      Nhà tuyển dụng bị cấm hoạt động
                    </span>
                  </div>
                  <div className="flex items-end justify-end">
                    <span className="text-4xl font-bold text-red-900">
                      {bannedUsers}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <PendingJobWidget
                startDate={startDate}
                endDate={endDate}
                onJobClick={openJobModal}
              />
              <PendingCompanyWidget
                startDate={startDate}
                endDate={endDate}
                onCompanyClick={openCompanyModal}
              />
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-4xl">
                <PendingReportWidget startDate={startDate} endDate={endDate} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen p-4 bg-gray-50">
          <PostAdmin />
        </div>
      )}
      {page === "dashboard" && selectedJob && (
        <ViewModal
          isOpen={isModalOpen}
          onClose={closeJobModal}
          job={selectedJob}
          update={false}
          onOpenChatRequest={() => {}}
          admin={true}
          activeUser={""}
        />
      )}
      {page === "dashboard" && selectedCompany && (
        <ModalViewCompany
          selectedDepartment={selectedCompany}
          setSelectedDepartment={setSelectedCompany}
          admin={true}
          onUpdated={() => {
            closeCompanyModal();
          }}
        />
      )}
    </>
  );
};

export default DashboardContent;
