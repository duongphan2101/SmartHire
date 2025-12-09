import React, { useState, useEffect } from "react";

import "./Home.css";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";
import { fetchProvinces_V2, type Province } from "../../utils/provinceApi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import imageBanner from "../../assets/images/banner-21.png";
import cv_banner from "../../assets/images/man_with_bent_arm.png";

import { IoLocationOutline } from "react-icons/io5";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RiContrastDrop2Line } from "react-icons/ri";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { FaServer, FaProjectDiagram, FaChartLine, FaNetworkWired, FaBug, FaCloud, FaCode, FaLaptopCode } from "react-icons/fa";

import useJob from "../../hook/useJob";
import useUser from "../../hook/useUser";
import useApplication from "../../hook/useApplication";
import { useNavigate } from "react-router-dom";
import type { ChatRoom } from "../../utils/interfaces";
import ChatModal from "../../components/Chat/Chat";
import DragorClick from "../../components/DragorClick/DragorClick";

const MySwal = withReactContent(Swal);

const Home: React.FC = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [animate, setAnimate] = useState(true);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [location, setLocation] = useState("");

  // Gộp useJob lại thành 1 lần gọi để state được đồng bộ
  const { filterJobs, joblatest, categories_sum, latest } = useJob();

  const { saveJob, unsaveJob, user, getUser } = useUser();
  const navigate = useNavigate();

  const [backend, setBackend] = useState<number>(0);
  const [projectmanager, setProjectmanager] = useState<number>(0);
  const [dataanalyst, setDataanalyst] = useState<number>(0);
  const [systemadminitrator, setSystemadminitrator] = useState<number>(0);
  const [qaengineer, setQaengineer] = useState<number>(0);
  const [devopsengineer, setDevopsengineer] = useState<number>(0);
  const [frontend, setFrontend] = useState<number>(0);
  const [fullstack, setFullstack] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<'latest' | 'recommended'>('latest');
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const { renderMatchingJob } = useApplication();
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [openChat, setIsChatOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null);
  const [fitJobNotify, setFitJobNotify] = useState<string>("Chưa có công việc nào phù hợp với bạn.");

  const slogans = [
    "cơ hội phát triển!",
    "nhà tuyển dụng hàng đầu!",
    "việc làm mơ ước!",
    "tương lai tương sáng!",
    "ứng viên tiềm năng!",
  ];
  const [slogan, setSlogan] = useState(slogans[0]);

  const handleSearch = async () => {
    // Truyền vào 1 object thay vì 2 tham số rời rạc
    const results = await filterJobs({ title: jobTitle, location: location });

    if (results && results.length > 0) {
      navigate(
        `/jobdetail/${results[0]._id}?title=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}`
      );
    } else {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Không có công việc phù hợp",
      });
    }
  };

  const handleItem = async (title: string) => {
    const results = await categories_sum(title);
    if (results.data.length > 0) {
      navigate(
        `/jobdetail/${results.data[0]._id}?title=${encodeURIComponent(title)}`
      );
    } else {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Không có công việc phù hợp",
      });
    }
  };

  useEffect(() => {
    document.title = "S m a r t H i r e - Trang chủ";
    fetchProvinces_V2().then(setProvinces);
    latest();

    let index = 0;
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        index = (index + 1) % slogans.length;
        setSlogan(slogans[index]);
        setAnimate(true);
      }, 50);
    }, 3000);

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setIsLogin(true);
        const idToFetch = parsed.user_id ?? parsed._id;
        getUser(idToFetch);
      }
    } catch (e) {
      console.error("Invalid user data in localStorage", e);
      setIsLogin(false);
    }

    return () => clearInterval(interval);
  }, [getUser, latest]); // Thêm latest vào dependency

  useEffect(() => {
    const fetchData = async () => {
      const back_end = await categories_sum("Backend");
      setBackend(back_end.sum);
      const project_manager = await categories_sum("Project");
      setProjectmanager(project_manager.sum);
      const data_analyst = await categories_sum("Data");
      setDataanalyst(data_analyst.sum);
      const system_minitrator = await categories_sum("System");
      setSystemadminitrator(system_minitrator.sum);
      const qa_engineer = await categories_sum("Qa");
      setQaengineer(qa_engineer.sum);
      const devops_engineer = await categories_sum("DevOps");
      setDevopsengineer(devops_engineer.sum);
      const front_end = await categories_sum("Frontend");
      setFrontend(front_end.sum);
      const full_stack = await categories_sum("FullStack");
      setFullstack(full_stack.sum);
    };
    fetchData();
  }, []); // categories_sum là stable từ hook nên có thể để [] hoặc [categories_sum]

  const [lastestJobs, setLastestJobs] = useState<any[]>([]);

  useEffect(() => {
    if (!joblatest) return;

    const mapped = joblatest.map((job) => ({
      ...job,
      isSaved: user ? user.liked.includes(job._id) : false,
      animateSave: false,
    }));

    setLastestJobs(mapped);
  }, [joblatest, user]);

  const toggleSave = async (jobId: string) => {
    if (!user) {
      MySwal.fire({
        title: "Bạn cần đăng nhập",
        text: "Hãy đăng nhập để lưu bài đăng.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#0F828C",
        cancelButtonColor: "#ccc",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    const currentJob = lastestJobs.find((j) => j._id === jobId);
    if (!currentJob) return;

    const isSavedNext = !currentJob.isSaved;

    setLastestJobs((prev) =>
      prev.map((job) =>
        job._id === jobId
          ? { ...job, isSaved: isSavedNext, animateSave: true }
          : job
      )
    );

    if (isSavedNext) {
      await saveJob(user._id, jobId);
    } else {
      await unsaveJob(user._id, jobId);
    }

    setTimeout(() => {
      setLastestJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, animateSave: false } : job
        )
      );
    }, 300);
  };

  const formatTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
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

  const getTimeAgo = (postedAt: string, updatedAt?: string): string => {
    const postedAgo = formatTimeAgo(postedAt);

    if (updatedAt && updatedAt !== postedAt) {
      const updatedAgo = formatTimeAgo(updatedAt);
      return `Cập nhật ${updatedAgo}`;
    }

    return `Đăng ${postedAgo}`;
  };

  const hanldeView = (id: string) => {
    navigate(
      `/jobdetail/${id}?title=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}`
    );
  };

  const categories = [
    {
      id: 1,
      name: "Backend Developer",
      description: "Xây dựng logic và hệ thống phía server, xử lý dữ liệu và API.",
      icon: <FaServer className="box-icon_icon" size={100} color="#fff" />,
      color: "#A7C7E7",
      posted: backend,
      url: "backend",
    },
    {
      id: 2,
      name: "Project Manager",
      description: "Quản lý dự án, lập kế hoạch, phân công và giám sát tiến độ.",
      icon: <FaProjectDiagram className="box-icon_icon" size={100} color="#fff" />,
      color: "#F7C5CC",
      posted: projectmanager,
      url: "project",
    },
    {
      id: 3,
      name: "Data Analyst",
      description: "Phân tích dữ liệu, tạo báo cáo giúp đưa ra quyết định chiến lược.",
      icon: <FaChartLine className="box-icon_icon" size={100} color="#fff" />,
      color: "#B5EAD7",
      posted: dataanalyst,
      url: "data",
    },
    {
      id: 4,
      name: "System Administrator",
      description: "Quản lý, bảo trì hệ thống mạng, máy chủ và bảo mật hạ tầng IT.",
      icon: <FaNetworkWired className="box-icon_icon" size={100} color="#fff" />,
      color: "#FFDAC1",
      posted: systemadminitrator,
      url: "system",
    },
    {
      id: 5,
      name: "QA Engineer",
      description: "Kiểm thử phần mềm, phát hiện lỗi và đảm bảo chất lượng sản phẩm.",
      icon: <FaBug className="box-icon_icon" size={100} color="#fff" />,
      color: "#E993B6",
      posted: qaengineer,
      url: "qa",
    },
    {
      id: 6,
      name: "DevOps Engineer",
      description: "Tự động hóa quy trình CI/CD, triển khai và giám sát hệ thống.",
      icon: <FaCloud className="box-icon_icon" size={100} color="#fff" />,
      color: "#CBAACB",
      posted: devopsengineer,
      url: "devops",
    },
    {
      id: 7,
      name: "Frontend Developer",
      description: "Thiết kế giao diện web, tối ưu trải nghiệm người dùng (UI/UX).",
      icon: <FaCode className="box-icon_icon" size={100} color="#fff" />,
      color: "#FFB7B2",
      posted: frontend,
      url: "frontend",
    },
    {
      id: 8,
      name: "FullStack Developer",
      description: "Phát triển cả frontend và backend, xử lý toàn bộ luồng ứng dụng.",
      icon: <FaLaptopCode className="box-icon_icon" size={100} color="#fff" />,
      color: "#F4E1D2",
      posted: fullstack,
      url: "fullstack",
    },
  ];

  function darkenColor(color: string, percent: number) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  useEffect(() => {
    if (activeTab !== "recommended") {
      setRecommendedJobs([]);
      return;
    }
    setIsLoadingRecommended(true);
    if (!user) {
      setRecommendedJobs([]);
      setIsLoadingRecommended(false);
      return;
    }
    if (!user.cv || user.cv.length === 0) {
      setRecommendedJobs([]);
      setIsLoadingRecommended(false);
      setFitJobNotify("Bạn cần tạo hoặc tải CV lên để nhận gợi ý việc làm.");
      return;
    }

    const firstCv = user.cv[0];
    const cid =
      typeof firstCv === "string"
        ? firstCv
        : (firstCv as { _id?: string })._id ?? (firstCv as unknown as string);

    if (!cid) {
      console.warn("No CV id found");
      setRecommendedJobs([]);
      setIsLoadingRecommended(false);
      return;
    }
    renderMatchingJob({ cv_id: cid })
      .then((res) => {
        if (res && Array.isArray(res)) {
          const mappedRecommended = res.map((item: any) => ({
            ...item,
            job: {
              ...item.job,

              isSaved: user ? user.liked.includes(item.job._id) : false,
              animateSave: false,
            },
          }));
          setRecommendedJobs(mappedRecommended);
        } else {
          console.warn("API response is not an array.");
          setRecommendedJobs([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching recommended jobs:", err);
        setRecommendedJobs([]);
      })
      .finally(() => {
        setIsLoadingRecommended(false);
      });
  }, [activeTab, user, renderMatchingJob]);

  const handleOpenChatRequest = (room?: ChatRoom) => {
    if (room) {
      setCurrentChatRoom(room);
    }
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <div className="App">
        <Header onOpenChat={handleOpenChatRequest} />

        {openChat && (
          <ChatModal room={currentChatRoom} onClose={handleCloseChat} />
        )}

        <ChatWithAI />
        <div className="containerStyle">

          <div className="container-fluid container-fluid_banner">
            <div className="container-banner flex flex-wrap xl:flex-nowrap">
              <div className="container-banner_item w-full xl:w-7/12 p-2 flex flex-col justify-center items-center">
                <div className="box-slogan">
                  <div className="box-box-slogan">
                    <span className="span-slogan-par">Kết nối bạn với</span>
                    <div className="span-slogan">
                      <span
                        className={`slogan-text ${animate ? "slide-up" : ""}`}
                      >
                        {slogan}
                      </span>
                    </div>
                  </div>
                  <p className="slogan-content">
                    Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu.
                    Nền tảng của chúng tôi giúp bạn dễ dàng tìm kiếm, ứng tuyển
                    và quản lý sự nghiệp của mình.
                  </p>
                </div>

                <div
                  className="banner-item-select bg-white gap-5 rounded-lg shadow-md flex flex-wrap xl:flex-nowrap items-center justify-around p-4 w-full max-w-3xl"
                  style={{ padding: 10 }}
                >
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
                    <option value="Legal Specialist">Legal Specialistr</option>
                    <option value="Admin Intern">Admin Intern</option>
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
              </div>

              <div className="banner-item-image container-banner_item w-full xl:w-5/12 p-2 hidden xl:flex justify-center items-center">
                <div className="shape-background"></div>
                <img
                  className="imageBanner max-w-xs"
                  src={imageBanner}
                  alt="Banner"
                />
              </div>
            </div>
          </div>

          <div className="container-fluid container-fluid_cvbuilder">
            <div className="container-cvbuilder flex flex-wrap xl:flex-nowrap">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 w-full">
                <div className="container-cvbuilder_banner">
                  <div className="container-cvbuilder_shape"></div>
                  <img className="cvBuilder-banner" src={cv_banner} />
                </div>

                <div className="container-cvbuilder_content flex flex-col items-center justify-center gap-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Tạo CV ấn tượng – Chạm gần hơn đến công việc mơ ước
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    Theo khảo sát,{" "}
                    <span className="font-semibold text-emerald-600">
                      {" "}
                      65% nhà tuyển dụng{" "}
                    </span>
                    cho biết họ chỉ dành{" "}
                    <span className="font-semibold">30 giây</span> để xem một
                    CV. Một CV rõ ràng và chuyên nghiệp có thể giúp ứng viên{" "}
                    <span className="font-semibold text-emerald-600">
                      tăng gấp 2 lần cơ hội được gọi phỏng vấn
                    </span>
                    .
                  </p>

                  <button
                    className="cssbuttons-io-button"
                    onClick={() => {
                      window.location.href = "/buildcv";
                    }}
                  >
                    Bắt đầu ngay
                    <div className="icon">
                      <svg
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path
                          d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </button>

                  <div className="w-full">
                    {isLogin && (
                      <DragorClick />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid container-fluid_categories">
            <div className="container-categories flex flex-wrap xl:flex-nowrap">
              <div
                className="flex w-full align-middle justify-center flex-col"
                style={{ paddingTop: 50, paddingBottom: 30 }}
              >
                <p style={{ fontSize: 34, padding: 30, fontWeight: "bolder" }}>
                  Khám phá các cơ hội việc làm hàng đầu
                </p>
                <p className="text-gray-600">
                  Tìm kiếm công việc mơ ước của bạn. Chúng tôi kết nối bạn với
                  những nhà tuyển dụng hàng đầu.
                </p>
              </div>

              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
                  {categories.map((item, idx) => (
                    <a key={idx} onClick={() => handleItem(item.url)} className="shadow-2xl bg-transparent cursor-pointer relative"
                      style={{ borderRadius: "10px", overflow: 'hidden' }}>
                      <div key={idx} className="categories-item bg-transparent"
                        style={{
                          backgroundColor: item.color,
                          transition: "all 0.3s ease",
                          borderRadius: "10px",
                          height: "280px",
                        }}
                      >
                        <div className="item-bottom">
                          <span className="item-title">{item.name}</span>
                          <p className="text-gray-500 text-sm text-left" style={{ marginTop: 10 }}>{item.description}</p>
                          <span className="item-posted">
                            Bài đăng:
                            <span
                              className="bg-emerald-500"
                              style={{
                                color: "#fff",
                                marginLeft: 10,
                                padding: "5px 15px",
                                borderRadius: 10,
                                fontSize: 12,
                                zIndex: 1
                              }}
                            >
                              {item.posted}
                            </span>
                          </span>
                        </div>

                        <div className="absolute box-icon-category -right-7 -bottom-7 box-icon"
                          style={{
                            backgroundColor: darkenColor(item.color, 5),
                            padding: 40,
                            borderRadius: "50%",
                            zIndex: 0
                          }}
                        >
                          {item.icon}
                        </div>

                      </div>
                    </a>
                  ))}

                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid container-fluid_latest">
            <div className="container-lastest flex flex-wrap xl:flex-nowrap">
              <div
                className="flex w-full align-middle justify-center flex-col"
                style={{ paddingTop: 50, paddingBottom: 30 }}
              >
                <p
                  className="text-gray-800"
                  style={{ fontSize: 34, padding: 30, fontWeight: "bold" }}
                >
                  Cơ Hội Không Thể Bỏ Lỡ
                </p>
                <p className="text-gray-600">
                  Chúng tôi vừa thêm những cơ hội nghề nghiệp chất lượng dành cho bạn.
                </p>
              </div>
              <div className="w-full">
                <div className="flex items-center justify-center mb-8">
                  <div className="flex rounded-lg">
                    <button
                      className={`tab-btn ${activeTab === "latest" ? "active" : ""}`}
                      onClick={() => setActiveTab("latest")}
                    >
                      Mới nhất
                    </button>
                    <button
                      className={`tab-btn ${activeTab === "recommended" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("recommended")}
                    >
                      Phù hợp với bạn
                    </button>
                  </div>
                </div>

                {activeTab === "latest" && (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {lastestJobs.map((item) => (
                      <div key={item._id} className="lasted-item flex flex-col">
                        <div className="lasted-item_top flex justify-between">
                          <div className="item-top_left flex justify-around">
                            <img
                              src={item.department.avatar}
                              className="lasted-item_image"
                            />
                          </div>
                          <div className="item-top_center flex flex-col flex-1 text-left">
                            <p
                              className="lasted-item-nameJob"
                              style={{ fontSize: 16, fontWeight: "bold" }}
                            >
                              {item.jobTitle}
                            </p>
                            <div
                              style={{
                                fontSize: 16,
                                paddingTop: 5,
                                paddingBottom: 10,
                              }}
                              className="lasted-item-department flex gap-4"
                            >
                              <p className="text-gray-800">{item.department.name}</p>
                              <span className="text-gray-600">
                                {getTimeAgo(item.createdAt!, item.updatedAt!)}
                              </span>
                            </div>
                            <div className="flex gap-3 lasted-techs flex-wrap">
                              {item.skills.slice(0, 3).map((i: string, index: number) => (
                                <div key={index} className="lasted-tech-item">
                                  {i.length > 10 ? i.slice(0, 10) + "..." : i}
                                </div>
                              ))}
                              {item.skills.length > 3 && (
                                <div className="lasted-tech-item">...</div>
                              )}
                            </div>
                          </div>
                          <div className="item-top_right">
                            <button
                              className="btn-apply"
                              onClick={() => hanldeView(item._id)}
                            >
                              <FaRegEye />
                            </button>
                          </div>
                        </div>
                        <div className="lasted-item_bottom items-center gap-2">
                          <ul className="flex gap-6 flex-1" style={{ marginTop: 15 }}>
                            <li
                              className="bottom-li flex gap-3 items-center"
                              style={{ fontSize: 13 }}
                            >
                              <IoLocationOutline color="#059669" /> {item.location}
                            </li>
                            <li
                              className="bottom-li flex gap-3 items-center"
                              style={{ fontSize: 13 }}
                            >
                              <FaRegMoneyBillAlt color="#059669" /> {item.salary}
                            </li>
                            <li
                              className="bottom-li flex gap-3 items-center"
                              style={{ fontSize: 13 }}
                            >
                              <AiOutlineClockCircle color="#059669" />
                              {item.jobType}
                            </li>
                            <li
                              className="bottom-li flex gap-3 items-center"
                              style={{ fontSize: 13 }}
                            >
                              <RiContrastDrop2Line color="#059669" />
                              {item.jobLevel}
                            </li>
                          </ul>
                          <div
                            className={`cursor-pointer flex items-center gap-2 text-xl transition-transform duration-300 ${item.animateSave ? "scale-125" : "scale-100"
                              } ${item.isSaved
                                ? "bg-emerald-600 text-white"
                                : "text-gray-500 bg-gray-100"
                              }`}
                            style={{ padding: 5, borderRadius: 5 }}
                            onClick={() => toggleSave(item._id)}
                          >
                            <span
                              style={{ fontSize: 12 }}
                              className={`${item.isSaved ? "text-white" : "text-gray-500"
                                }`}
                            >
                              {item.isSaved ? "Đã lưu" : "Lưu bài đăng"}
                            </span>
                            {item.isSaved ? (
                              <FaBookmark color="#fff" size={14} />
                            ) : (
                              <FaRegBookmark color="gray" size={14} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'recommended' && (
                  <>
                    {isLoadingRecommended ? (
                      <div className="relative w-full" style={{ paddingTop: 100 }}>
                        <div className="banter-loader">
                          <div className="banter-loader__box"></div>
                          <div className="banter-loader__box"></div>
                          <div className="banter-loader__box"></div>
                          <div className="banter-loader__box"></div>
                          <div className="banter-loader__box"></div>
                          <div className="banter-loader__box"></div>
                          <div className="banter-loader__box"></div>
                          <div className="banter-loader__box"></div>
                          <div className="banter-loader__box"></div>
                        </div>
                      </div>
                    ) : recommendedJobs.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        {recommendedJobs.filter(item => item.job.status === "active").slice(0, 8).map((item) => (
                          <div key={item.job._id} className="lasted-item flex flex-col gap-2">

                            <div className="lasted-item_top flex justify-between">
                              <div className="item-top_left flex justify-around">
                                <img
                                  src={item.job.department.avatar}
                                  className="lasted-item_image"
                                />
                              </div>
                              <div className="item-top_center flex flex-col flex-1 text-left">
                                <p
                                  className="lasted-item-nameJob"
                                  style={{ fontSize: 16, fontWeight: "bold" }}
                                >
                                  {item.job.jobTitle}
                                </p>
                                <div
                                  style={{
                                    fontSize: 16,
                                    paddingTop: 5,
                                    paddingBottom: 10,
                                  }}
                                  className="lasted-item-department flex gap-4"
                                >
                                  <p className="text-gray-800">{item.job.department.name}</p>
                                  <span className="text-gray-600">
                                    {getTimeAgo(item.job.createdAt!, item.job.updatedAt!)}
                                  </span>
                                </div>
                                <div className="flex gap-3 lasted-techs flex-wrap">
                                  {item.job.skills
                                    .slice(0, 3)
                                    .map((i: string, index: number) => (
                                      <div key={index} className="lasted-tech-item">
                                        {i.length > 10 ? i.slice(0, 10) + "..." : i}
                                      </div>
                                    ))}
                                  {item.job.skills.length > 3 && (
                                    <div className="lasted-tech-item">...</div>
                                  )}
                                </div>
                              </div>
                              <div className="item-top_right">
                                <button
                                  className="btn-apply"
                                  onClick={() => hanldeView(item.job._id)}
                                >
                                  <FaRegEye />
                                </button>
                              </div>
                            </div>

                            <div className="lasted-item_bottom gap-2">

                              <ul className="flex gap-6 flex-1">
                                <li
                                  className="bottom-li flex gap-3 items-center"
                                  style={{ fontSize: 13 }}
                                >
                                  <IoLocationOutline color="#059669" /> {item.job.location}
                                </li>
                                <li
                                  className="bottom-li flex gap-3 items-center"
                                  style={{ fontSize: 13 }}
                                >
                                  <FaRegMoneyBillAlt color="#059669" /> {item.job.salary}
                                </li>
                                <li
                                  className="bottom-li flex gap-3 items-center"
                                  style={{ fontSize: 13 }}
                                >
                                  <AiOutlineClockCircle color="#059669" />
                                  {item.job.jobType}
                                </li>
                                <li
                                  className="bottom-li flex gap-3 items-center"
                                  style={{ fontSize: 13 }}
                                >
                                  <RiContrastDrop2Line color="#059669" />
                                  {item.job.jobLevel}
                                </li>
                              </ul>

                              <div className="flex items-center gap-3">
                                <div
                                  className={`cursor-pointer flex items-center gap-2 text-xl transition-transform duration-300 ${item.animateSave ? "scale-125" : "scale-100"
                                    } ${item.job.isSaved
                                      ? "bg-emerald-600 text-white"
                                      : "text-gray-500 bg-gray-100"
                                    }`}
                                  style={{ padding: 5, borderRadius: 5 }}
                                  onClick={() => toggleSave(item.job._id)}
                                >
                                  <span
                                    style={{ fontSize: 12 }}
                                    className={`${item.job.isSaved ? "text-white" : "text-gray-500"
                                      }`}
                                  >
                                    {item.job.isSaved ? "Đã lưu" : "Lưu bài đăng"}
                                  </span>
                                  {item.job.isSaved ? (
                                    <FaBookmark color="#fff" size={14} />
                                  ) : (
                                    <FaRegBookmark color="gray" size={14} />
                                  )}
                                </div>

                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="w-full text-center text-gray-600">
                        {fitJobNotify}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>



          {/* <div className="container-fluid container-fluid_chart">
            <div className="container-chart flex flex-wrap xl:flex-nowrap">

            </div>
          </div> */}

        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;