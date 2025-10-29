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
import Swal from "sweetalert2";

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
  const [experience, setExperience] = useState(queryParams.get("experience") || "");
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
    window.scrollTo(0, 0);
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

  // Fetch related jobs mặc định (chỉ khi load trang)
  useEffect(() => {
    const fetchRelated = async () => {
      if (!id) return;
      setLoadingRelated(true);

      const jobData = await getJobById(id);
      setJob(jobData);

      if (jobData) {
        const results = joblatest || [];
        setRelatedJobs(results.filter((j) => j._id !== id));
      }

      setLoadingRelated(false);
    };

    fetchRelated();
  }, [id]);

  // Khi bấm nút tìm kiếm
  const handleSearch = async () => {
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

      if (results.length > 0) {
        setRelatedJobs(results);
        navigate(
          `/jobdetail/${results[0]._id}?title=${jobTitle}&location=${location}&district=${district}&jobType=${jobType}&jobLevel=${jobLevel}&experience=${experience}`,
          { replace: true }
        );
      } else {
        setRelatedJobs([]);
        let message = "Không tìm thấy công việc phù hợp";

        if (location) message = "Địa điểm này không có công việc bạn cần";
        else if (district) message = "Quận/Huyện này không có công việc bạn cần";
        else if (jobTitle) message = "Không có công việc phù hợp với vị trí này";
        else if (jobType) message = "Không có công việc với hình thức này";
        else if (jobLevel) message = "Không có công việc với level này";
        else if (experience) message = "Không có công việc với kinh nghiệm này";

        Swal.fire({
          icon: "info",
          title: "Thông báo",
          text: message,
          confirmButtonText: "Đóng",
        });
      }
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setRelatedJobs([]);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau!",
      });
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
      `/jobdetail/${id}?title=${jobTitle}&location=${location}&district=${district}&jobType=${jobType}&jobLevel=${jobLevel}&experience=${experience}`,
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
            {/* HÀNG 1: nameJob + location */}
            <div className="content-main-header bg-white w-full flex gap-5 flex-col xl:flex-row">
              {/* Combobox Vị trí tuyển dụng */}
              <select
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full xl:w-2/6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                style={{ paddingLeft: 10 }}
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
                style={{ paddingLeft: 10 }}
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
                style={{ paddingLeft: 10 }}
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
            <div className="bg-white w-full flex gap-5 flex-col xl:flex-row content-main-header">
              <select
                className="w-full xl:w-2/6 h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                style={{ paddingLeft: 10 }}
              >
                <option value="">Hình thức làm việc</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Freelance">Freelance</option>
                <option value="Remote">Remote</option>
              </select>

              <select
                className="w-full xl:w-2/6 h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={jobLevel}
                onChange={(e) => setJobLevel(e.target.value)}
                style={{ paddingLeft: 10 }}
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
                className="w-full xl:w-2/6 h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                style={{ paddingLeft: 10 }}
              >
                <option value="">Kinh nghiệm làm việc</option>
                <option value="none">Không yêu cầu</option>
                <option value="lt1">Kinh nghiệm dưới 1 năm</option>
                <option value="1-3">Kinh nghiệm 1 - 3 năm</option>
                <option value="3-5">Kinh nghiệm 3 - 5 năm</option>
                <option value="5-7">Kinh nghiệm 5 - 7 năm</option>
                <option value="7-10">Kinh nghiệm 7 - 10 năm</option>
                <option value="gt10">Kinh nghiệm trên 10 năm</option>
              </select>
            </div>

            <div className="content-main-center grid grid-cols-1 md:grid-cols-9 lg:grid-cols-9 gap-2 w-full">
              <div className="lg:col-span-3 md:col-span-3">
                <div className="head-card head-left gap-5">
                  <div className="head-left-top flex w-full">
                    <p className="font-bold">Có liên quan</p>
                    <button className="btn-filter flex items-center font-bold">
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
                            className="bg-gray-100"
                            style={{ borderRadius: 5, padding: 5 }}
                          >
                            <img
                              className="job-item-image"
                              src={
                                item.department.avatar || "/default-avatar.png"
                              }
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
