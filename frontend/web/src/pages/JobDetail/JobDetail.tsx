import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./JobDetails.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import { BsFilter } from "react-icons/bs";
import Detail from "../../components/Detail-Job/Detail";
import useJob, { type Job } from "../../hook/useJob";
import useUser, { type UserResponse } from "../../hook/useUser";

interface District {
  code: number;
  name: string;
}

interface Province {
  code: number;
  name: string;
  districts: District[];
}

interface DetailProps {
  item: Job;
  saveJob: (userId: string, jobId: string) => Promise<UserResponse | void>;
  unsaveJob: (userId: string, jobId: string) => Promise<UserResponse | void>;
}

const JobDetails: React.FC<DetailProps> = () => {
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loadingJob, setLoadingJob] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [job, setJob] = useState<Job | null>(null);

  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);

  const [jobTitle, setJobTitle] = useState(queryParams.get("title") || "");
  const [location, setLocation] = useState(queryParams.get("location") || "");
  const [jobType, setJobType] = useState(queryParams.get("jobType") || "");
  const [jobLevel, setJobLevel] = useState(queryParams.get("jobLevel") || "");
  const [district, setDistrict] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const { id } = useParams<{ id: string }>();
  const { getJobById, filterJobs, joblatest } = useJob();
  const navigate = useNavigate();
  const { saveJob, unsaveJob } = useUser();

  // Lấy job chi tiết
  const fetchJob = async (id: string) => {
    setLoadingJob(true);
    const jobData = await getJobById(id);
    if (jobData) setJob(jobData);
    setLoadingJob(false);
  };

  useEffect(() => {
    if (id) fetchJob(id);
  }, [id]);

  // Load danh sách tỉnh/thành (có cả quận/huyện trong depth=2)
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error("fetch provinces error:", err);
      }
    };
    loadProvinces();
  }, []);

  // Khi chọn tỉnh → set districts
  useEffect(() => {
    if (location) {
      const selectedProvince = provinces.find((p) => p.name === location);
      if (selectedProvince) {
        setDistricts(selectedProvince.districts);
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  }, [location, provinces]);

  // Fetch related jobs
  useEffect(() => {
    const fetchRelated = async () => {
      if (!id) return;
      setLoadingRelated(true);

      const jobData = await getJobById(id);
      setJob(jobData);

      if (jobData) {
      const results =
        jobTitle || location || district || jobType || jobLevel
          ? await filterJobs(jobTitle, location, district, jobType, jobLevel)
          : joblatest || [];

      setRelatedJobs(results.filter((j) => j._id !== id));
    }

      setLoadingRelated(false);
    };

    fetchRelated();
  },[id, jobTitle, location, district, jobType, jobLevel]);

  // Khi bấm nút tìm kiếm
const handleSearch = async () => {
  setLoadingRelated(true);
  try {
    const results = await filterJobs(jobTitle, location, district, jobType, jobLevel);
    if (results.length > 0) {
      setRelatedJobs(results);
      navigate(
        `/jobdetail/${results[0]._id}?title=${jobTitle}&location=${location}&district=${district}&jobType=${jobType}&jobLevel=${jobLevel}`
      );
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

  // Khi click vào job trong related list
  const handlerJobItem = async (id: string) => {
  setLoadingJob(true);
  const jobData = await getJobById(id);
  if (jobData) setJob(jobData);
  setLoadingJob(false);
  navigate(
    `/jobdetail/${id}?title=${jobTitle}&location=${location}&district=${district}&jobType=${jobType}&jobLevel=${jobLevel}`,
    { replace: true }
  );
};

  return (
    <>
      <div className="App-JobDetail">
        <Header />
        <ChatWithAI />

        <div className="content bg-gray-50">
          <div className="content-main flex flex-wrap xl:flex-nowrap flex-col gap-5">
            <div className="content-main-header bg-white w-full flex gap-5 flex-col xl:flex-row">
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

              {/* Combobox Quận/Huyện */}
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full xl:w-2/6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.name}>
                    {d.name}
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
            {/* HÀNG 2: jobType + jobLevel */}
            <div className="bg-white w-full flex gap-5 flex-col xl:flex-row p-2">
              <select
                className="w-full xl:w-2/6 h-12 px-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full xl:w-2/6 h-12 px-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={jobLevel}
                onChange={(e) => setJobLevel(e.target.value)}
              >
                <option value="">Vị trí (Level)</option>
                <option value="Internship">Internship</option>
                <option value="Fresher">Fresher</option>
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
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
                      <p className="text-gray-500">
                        Đang tải công việc liên quan...
                      </p>
                    ) : (
                      (relatedJobs.length > 0
                        ? relatedJobs
                        : joblatest || []
                      ).map((item) => (
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
                              src={item.department.avatar || "/default-avatar.png"}
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
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 md:col-span-6">
                <div className="head-card">
                  {loadingJob ? (
                    <p className="text-gray-500">Đang tải...</p>
                  ) : job ? (
                    <Detail item={job} saveJob={saveJob} unsaveJob={unsaveJob} />
                  ) : (
                    <p className="text-gray-500">
                      Hãy chọn 1 công việc để xem chi tiết
                    </p>
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
