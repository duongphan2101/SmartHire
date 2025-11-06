import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./JobDetails.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import { BsFilter } from "react-icons/bs";
import Detail from "../../components/Detail-Job/Detail";
import useJob, { type Job } from "../../hook/useJob";
import useUser from "../../hook/useUser";
import Swal from "sweetalert2";
import { fetchDistrictsByProvinceId, fetchProvinces_V2 } from "../../utils/provinceApi";
import { Pagination } from "antd";

interface District {
  code: number;
  name: string;
}

interface Province {
  code: number;
  name: string;
  districts: District[];
}

// Hằng số cho phân trang
const JOBS_PER_PAGE = 6;

const JobDetails: React.FC = () => {
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loadingJob, setLoadingJob] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);

  // --- STATES từ query ---
  const [jobTitle, setJobTitle] = useState(queryParams.get("title") || "");
  const [location, setLocation] = useState(queryParams.get("location") || "");
  const [jobType, setJobType] = useState(queryParams.get("jobType") || "");
  const [jobLevel, setJobLevel] = useState(queryParams.get("jobLevel") || "");
  const [experience, setExperience] = useState(queryParams.get("experience") || "");
  const [district, setDistrict] = useState(queryParams.get("district") || "");

  // --- Tỉnh / Quận ---
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const { getJobById, filterJobs, joblatest } = useJob();
  const { saveJob, unsaveJob } = useUser();

  // Lấy chi tiết job theo id
  const fetchJob = async (jobId: string) => {
    setLoadingJob(true);
    const jobData = await getJobById(jobId);
    if (jobData) setJob(jobData);
    setLoadingJob(false);
  };

  // Khi có id → load job chi tiết
  useEffect(() => {
    if (id) fetchJob(id);
    window.scrollTo(0, 0);
  }, [id]);

  // Load danh sách tỉnh
  useEffect(() => {
    fetchProvinces_V2().then(setProvinces);
  }, []);

  // Khi chọn tỉnh → GỌI API để tải quận/huyện
  useEffect(() => {
    if (!location) {
      setDistricts([]);
      return;
    }

    if (provinces.length > 0) {
      const selectedProvince = provinces.find(
        (p) => p.name === location
      );
      if (selectedProvince) {
        fetchDistrictsByProvinceId(selectedProvince.code)
          .then(setDistricts)
          .catch((err) => {
            console.error("Lỗi khi tải quận/huyện:", err);
            setDistricts([]); // Reset nếu có lỗi
          });
      }
    }
  }, [location, provinces]);

  // --- Hàm tìm kiếm ---
  const handleSearch = async (auto = false) => {
    setLoadingRelated(true);
    try {
      const results = await filterJobs(
        jobTitle,
        location,
        district,
        jobType,
        jobLevel,
        experience
      );

      if (results && results.length > 0) {
        setRelatedJobs(results);
        setCurrentPage(1); // Reset trang về 1 khi tìm kiếm mới

        // Chỉ chuyển trang nếu người dùng bấm nút Tìm kiếm
        if (!auto) {
          navigate(
            `/jobdetail/${results[0]._id}?title=${jobTitle}&location=${location}&district=${district}&jobType=${jobType}&jobLevel=${jobLevel}&experience=${experience}`,
            { replace: true }
          );
        }
      } else {
        setRelatedJobs([]);
        if (!auto) {
          Swal.fire({
            icon: "info",
            title: "Không tìm thấy công việc phù hợp",
            text: "Vui lòng thử lại với từ khóa hoặc địa điểm khác.",
            confirmButtonText: "Đóng",
          });
        }
      }
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setRelatedJobs([]);
      if (!auto) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau!",
        });
      }
    } finally {
      setLoadingRelated(false);
    }
  };

  // --- Khi truy cập trang từ Home → tự động tìm ---
  useEffect(() => {
    if (jobTitle || location || jobType || jobLevel || experience) {
      handleSearch(true);
    } else if (joblatest) {
      setRelatedJobs(joblatest);
    }
  }, []);

  // Khi bấm vào job trong danh sách bên trái
  const handlerJobItem = async (jobId: string) => {
    await fetchJob(jobId);
    navigate(
      `/jobdetail/${jobId}?title=${jobTitle}&location=${location}&district=${district}&jobType=${jobType}&jobLevel=${jobLevel}&experience=${experience}`,
      { replace: true }
    );
  };

  // Logic phân trang
  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  // Lấy dữ liệu công việc hiện tại (dùng relatedJobs vì đây là danh sách bên trái)
  const activeJobs = relatedJobs.filter(job => job.status === "active").reverse();
  const currentRelatedJobs = activeJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Hàm chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Tùy chọn: Cuộn lên đầu danh sách khi chuyển trang
    document.querySelector('.head-left-main')?.scrollTo(0, 0);
  };


  return (
    <div className="App-JobDetail">
      <Header />
      <ChatWithAI />

      <div className="content bg-gray-50">
        <div className="content-main flex flex-wrap xl:flex-nowrap flex-col gap-5">
          {/* HÀNG 1: nameJob + location */}
          <div className="content-main-header bg-white w-full flex gap-5 flex-col xl:flex-row">
            <select
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full xl:w-2/6 focus:outline-none focus:ring-2 focus:ring-emerald-500 p-2 rounded-md"
            >
              <option value="">Chọn vị trí tuyển dụng</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="designer">UI/UX Designer</option>
              <option value="manager">Project Manager</option>
              <option value="dataAnalyst">Data Analyst</option>
              <option value="sysAdmin">System Administrator</option>
              <option value="QA">QA Engineer</option>
              <option value="Legal Specialist">Legal Specialistr</option>
              <option value="Admin Intern">Admin Intern</option>
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full xl:w-2/6 focus:outline-none focus:ring-2 focus:ring-emerald-500 p-2 rounded-md"
            >
              <option value="">Chọn địa điểm</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full xl:w-2/6 focus:outline-none focus:ring-2 focus:ring-emerald-500 p-2 rounded-md"
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((d) => (
                <option key={d.code} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleSearch(false)}
              className="w-full xl:w-2/6 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition p-2 h-10"
            >
              Tìm kiếm
            </button>
          </div>

          {/* HÀNG 2: jobType + jobLevel + experience */}
          <div className="bg-white w-full flex gap-5 flex-col xl:flex-row content-main-header">
            <select
              className="w-full xl:w-2/6 h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 p-2 rounded-md"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">Hình thức làm việc</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Freelance">Freelance</option>
              <option value="Remote">Remote</option>
            </select>

            <select
              className="w-full xl:w-2/6 h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 p-2 rounded-md"
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
            >
              <option value="">Vị trí</option>
              <option value="Internship">Internship</option>
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>

            <select
              className="w-full xl:w-2/6 h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 p-2 rounded-md"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="">Kinh nghiệm</option>
              <option value="none">Không yêu cầu</option>
              <option value="lt1">Dưới 1 năm</option>
              <option value="1-3">1 - 3 năm</option>
              <option value="3-5">3 - 5 năm</option>
              <option value="5-7">5 - 7 năm</option>
              <option value="7-10">7 - 10 năm</option>
              <option value="gt10">Trên 10 năm</option>
            </select>
          </div>

          {/* DANH SÁCH + CHI TIẾT */}
          <div className="content-main-center grid grid-cols-1 md:grid-cols-9 gap-4 w-full">
            {/* Danh sách job bên trái */}
            <div className="lg:col-span-3 md:col-span-3">
              <div className="head-card head-left gap-5">
                <div className="head-left-top flex w-full justify-between">
                  <p className="font-semibold">Kết quả tìm kiếm</p>
                  {/* <button className="btn-filter flex items-center text-gray-600">
                    <BsFilter className="mr-1" />
                    Bộ lọc
                  </button> */}
                </div>

                <div className="head-left-main flex flex-col w-full">
                  {loadingRelated ? (
                    <p className="text-gray-500">Đang tải công việc...</p>
                  ) : (
                    (currentRelatedJobs.length > 0 ? currentRelatedJobs : []).map( // Dùng currentRelatedJobs (đã được phân trang)
                      (item) => (
                        <div
                          key={item._id}
                          className="job-item flex items-center gap-5 cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => handlerJobItem(item._id.toString())}
                        >
                          <img
                            className="job-item-image w-14 h-14 object-cover rounded-md bg-gray-100"
                            src={item.department?.avatar || "/default-avatar.png"}
                            alt="logo"
                          />
                          <div className="flex flex-col gap-1 text-left flex-2/4">
                            <span className="font-bold text-sm">{item.jobTitle}</span>
                            <span className="text-gray-500 text-xs">
                              {item.department?.name}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 text-right flex-1/4 text-xs text-gray-600">
                            <span className="text-sm">{item.jobLevel}</span>
                            <span className="text-sm">{item.jobType}</span>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>

                {/* PHẦN PHÂN TRANG */}
                {(relatedJobs.length > JOBS_PER_PAGE) && (
                  <div style={{ marginTop: '16px', textAlign: 'center' }} className="flex justify-center items-center">
                    <Pagination
                      current={currentPage}
                      total={relatedJobs.length}
                      pageSize={JOBS_PER_PAGE}
                      onChange={handlePageChange}
                      hideOnSinglePage={true}
                    />
                  </div>
                )}

              </div>
            </div>

            {/* Chi tiết job */}
            <div className="lg:col-span-6 md:col-span-6">
              <div className="head-card">
                {loadingJob ? (
                  <p className="text-gray-500">Đang tải chi tiết...</p>
                ) : job ? (
                  <Detail item={job} saveJob={saveJob} unsaveJob={unsaveJob} />
                ) : (
                  <p className="text-gray-500">Hãy chọn 1 công việc để xem chi tiết.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;