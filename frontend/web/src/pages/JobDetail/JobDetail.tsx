import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./JobDetails.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import { useNavigate } from "react-router-dom";
import { fetchProvinces, type Province } from "../../utils/provinceApi";
import { BsFilter } from "react-icons/bs";
import Detail from "../../components/Detail-Job/Detail";
import useJob, { type Job } from "../../hook/useJob";

// Thêm debounce utility
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const JobDetails: React.FC = () => {
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loadingJob, setLoadingJob] = useState(false); // Loading cho job chi tiết
  const [loadingRelated, setLoadingRelated] = useState(false); // Loading cho related jobs
  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);
  const [job, setJob] = useState<Job | null>(null);
  const [jobTitle, setJobTitle] = useState(queryParams.get("title") || "");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [location, setLocation] = useState(queryParams.get("location") || "");
  const { id } = useParams<{ id: string }>();
  const { getJobById } = useJob();
  const { filterJobs } = useJob();
  const { joblatest } = useJob(); // Lấy joblatest nhưng không phụ thuộc trực tiếp
  const navigate = useNavigate();

  const fetchJob = async (id: string) => {
    setLoadingJob(true);
    const jobData = await getJobById(id);
    if (jobData) setJob(jobData);
    setLoadingJob(false);
  };

  useEffect(() => {
    if (id) fetchJob(id);
  }, [id]);

  useEffect(() => {
    const loadProvinces = async () => {
      const data = await fetchProvinces();
      setProvinces(data);
    };
    loadProvinces();
  }, []);

  const fetchRelatedJobs = async () => {
    setLoadingRelated(true);
    try {
      console.log("Fetching related jobs with jobTitle:", jobTitle, "location:", location);
      const results = jobTitle || location ? await filterJobs(jobTitle, location) : joblatest || [];
      setRelatedJobs(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error("Error fetching related jobs:", error);
      setRelatedJobs([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  // Áp dụng debounce cho fetchRelatedJobs
  const debouncedFetchRelatedJobs = debounce(fetchRelatedJobs, 500); // Tăng delay lên 500ms

  useEffect(() => {
    debouncedFetchRelatedJobs();
    // Loại bỏ filterJobs và joblatest khỏi dependencies để tránh re-render không cần thiết
  }, [jobTitle, location]);

  const handleSearch = async () => {
    setLoadingRelated(true);
    try {
      const results = await filterJobs(jobTitle, location);
      if (results.length > 0) {
        setRelatedJobs(results);
        navigate(`/jobdetail/${results[0]._id}?title=${jobTitle}&location=${location}`);
      } else {
        setRelatedJobs([]);
        alert("Không tìm thấy công việc phù hợp");
      }
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setRelatedJobs([]);
    } finally {
      setLoadingRelated(false);
    }
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

  const handlerJobItem = async (id: string) => {
    setLoadingJob(true);
    const jobData = await getJobById(id);
    if (jobData) setJob(jobData);
    setLoadingJob(false);
    navigate(`/jobdetail/${id}?title=${jobTitle}&location=${location}`, { replace: true });
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
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="designer">UI/UX Designer</option>
                <option value="manager">Project Manager</option>
                <option value="dataAnalyst">Data Analyst</option>
                <option value="sysAdmin">System Administrator</option>
                <option value="QA">QA Engineer</option>
                <option value="DevEng">DevOps Engineer</option>
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
                      Bộ lọc
                    </button>
                  </div>

                  <div className="head-left-main flex flex-col w-full">
                    {loadingRelated ? (
                      <p className="text-gray-500">Đang tải công việc liên quan...</p>
                    ) : (relatedJobs.length > 0 ? relatedJobs : joblatest || []).map(
                      (item) => (
                        <div
                          key={item._id}
                          className="job-item flex items-center gap-5 cursor-pointer"
                          onClick={() => handlerJobItem(item._id.toString())}
                        >
                          <div
                            className="bg-gray-200"
                            style={{ borderRadius: 5, padding: 5 }}
                          >
                            <img
                              className="job-item-image"
                              src={item.department.avatar}
                            />
                          </div>
                          <div className="flex flex-col gap-2 text-left flex-2/4">
                            <span style={{ fontWeight: "bold" }}>
                              {item.jobTitle}
                            </span>
                            <div
                              className="flex gap-5"
                              style={{ fontSize: 15 }}
                            >
                              <span className="text-gray-500 department-name">
                                {item.department.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 text-center flex-1/4">
                            <span>{item.jobLevel}</span>
                            <span>{item.jobType}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6">
                <div className="head-card">
                  {loadingJob ? (
                    <p className="text-gray-500">Đang tải...</p>
                  ) : job ? (
                    <Detail item={job} />
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
};

export default JobDetails;