import React, { useState, useEffect } from 'react';

import './Home.css';
import Header from '../../components/Header/Header';
import ChatWithAI from '../../components/Chat-With-AI/ChatWithAI';
import Footer from '../../components/Footer/Footer';

import imageBanner from "../../assets/images/banner-21.png";

import IT from "../../assets/images/ITT.jpg";
import Commerce from "../../assets/images/commerce.jpg";
import Marketing from "../../assets/images/marketting.jpg";
import Finance from "../../assets/images/finance.webp";
import Engineering from "../../assets/images/engineering.webp";
import Education from "../../assets/images/education.jpg";
import HealCare from "../../assets/images/healcare.jpg";
import Travel from "../../assets/images/travel.jpg";

import apple from "../../assets/images/apple.png";
import google from "../../assets/images/google.png";
import nike from "../../assets/images/nike.png";
import stabuck from "../../assets/images/starbuck.png";
import volkswagen from "../../assets/images/volkswagen.png";
import meta from "../../assets/images/meta.png";

import { IoLocationOutline } from 'react-icons/io5';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { RiContrastDrop2Line } from 'react-icons/ri';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa';

const Home: React.FC = () => {

    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");
    const [animate, setAnimate] = useState(true);

    const slogans = ["cơ hội phát triển!", "nhà tuyển dụng hàng đầu!",
        "việc làm mơ ước!", "tương lai tương sáng!"];
    const [slogan, setSlogan] = useState(slogans[0]);

    const handleSearch = () => {
        alert(`Tìm kiếm: ${jobTitle} tại ${location}`);
    };

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setAnimate(false);
            setTimeout(() => {
                index = (index + 1) % slogans.length;
                setSlogan(slogans[index]);
                setAnimate(true);
            }, 50);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const categories = [
        {
            id: 1,
            name: "Công nghệ thông tin",
            image: IT,
            posted: 512,
            url: "/cong-nghe-thong-tin"
        },
        {
            id: 2,
            name: "Kinh doanh & Bán hàng",
            image: Commerce,
            posted: 351,
            url: "/kinh-doanh-ban-hang"
        },
        {
            id: 3,
            name: "Marketing & Truyền thông",
            image: Marketing,
            posted: 621,
            url: "/marketing"
        },
        {
            id: 4,
            name: "Tài chính & Kế toán",
            image: Finance,
            posted: 341,
            url: "/tai-chinh-ke-toan"
        },
        {
            id: 5,
            name: "Sản xuất & Kỹ thuật",
            image: Engineering,
            posted: 462,
            url: "/san-xuat-ky-thuat"
        },
        {
            id: 6,
            name: "Giáo dục & Đào tạo",
            image: Education,
            posted: 411,
            url: "/giao-duc-dao-tao"
        },
        {
            id: 7,
            name: "Chăm sóc sức khỏe",
            image: HealCare,
            posted: 48,
            url: "/cham-soc-suc-khoe"
        },
        {
            id: 8,
            name: "Du lịch & Dịch vụ",
            image: Travel,
            posted: 83,
            url: "/du-lich-dich-vu"
        }
    ];

    const lastest = [
        {
            id: 1,
            nameJob: "IOS Developer",
            department: "Apple",
            image: apple,
            tech: ["Object C", "Swift", "XCode"],
            url: "/",
            location: "Hà Nội",
            salary: "$1,200 - $1,800",
            level: "Fresher",
            type: "Fulltime",
            postedAt: "2025-08-13T10:00:00Z",
            updatedAt: "2025-08-14T13:04:00Z",
            isSaved: false
        },
        {
            id: 2,
            nameJob: "Frontend Developer",
            department: "Google",
            image: google,
            tech: ["HTML", "CSS", "JavaScript"],
            url: "/",
            location: "TP. Hồ Chí Minh",
            salary: "$1,000 - $1,500",
            level: "Junior",
            type: "Hybrid",
            postedAt: "2025-08-10T08:30:00Z",
            updatedAt: null,
            isSaved: false
        },
        {
            id: 3,
            nameJob: "Backend Developer",
            department: "Starbucks",
            image: stabuck,
            tech: ["Node.js", "Express", "MongoDB"],
            url: "/",
            location: "Đà Nẵng",
            salary: "$1,500 - $2,000",
            level: "Senior",
            type: "Onsite",
            postedAt: "2025-08-12T15:00:00Z",
            updatedAt: "2025-08-14T09:00:00Z",
            isSaved: false
        },
        {
            id: 4,
            nameJob: "Mobile App Developer",
            department: "Volkswagen",
            image: volkswagen,
            tech: ["Java", "Kotlin", "Android Studio"],
            url: "/",
            location: "Hà Nội",
            salary: "$1,000 - $1,700",
            level: "Fresher",
            type: "Remote",
            postedAt: "2025-08-08T10:00:00Z",
            updatedAt: null,
            isSaved: false
        },
        {
            id: 5,
            nameJob: "UI/UX Designer",
            department: "Nike",
            image: nike,
            tech: ["Figma", "Adobe XD", "Sketch"],
            url: "/",
            location: "TP. Hồ Chí Minh",
            salary: "$900 - $1,400",
            level: "Intern",
            type: "Parttime",
            postedAt: "2025-08-11T14:00:00Z",
            updatedAt: "2025-08-14T06:00:00Z",
            isSaved: false
        },
        {
            id: 6,
            nameJob: "Fullstack Developer",
            department: "Meta",
            image: meta,
            tech: ["React", "Node.js", "GraphQL"],
            url: "/",
            location: "Đà Nẵng",
            salary: "$1,800 - $2,500",
            level: "Senior",
            type: "Fulltime",
            postedAt: "2025-08-09T09:00:00Z",
            updatedAt: null,
            isSaved: false
        }
    ];

    const [lastestJobs, setLastestJobs] = useState(lastest.map(job => ({ ...job, animateSave: false })));

    const toggleSave = (id: number) => {
        setLastestJobs(prev =>
            prev.map(job => {
                if (job.id === id) {
                    // bật animation
                    return { ...job, isSaved: !job.isSaved, animateSave: true };
                }
                return job;
            })
        );

        // tắt animation sau 300ms
        setTimeout(() => {
            setLastestJobs(prev =>
                prev.map(job =>
                    job.id === id ? { ...job, animateSave: false } : job
                )
            );
        }, 300);
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

    return (
        <>
            <div className="App">
                <Header />
                <ChatWithAI />

                <div className="containerStyle">

                    <div className='container-fluid container-fluid_banner'>
                        <div className="container-banner flex flex-wrap xl:flex-nowrap">

                            <div className="container-banner_item w-full xl:w-7/12 p-2 flex flex-col justify-center items-center">

                                <div className='box-slogan'>
                                    <div className='box-box-slogan'>
                                        <span className='span-slogan-par'>Kết nối bạn với</span>
                                        <div className='span-slogan'>
                                            <span className={`slogan-text ${animate ? "slide-up" : ""}`}>
                                                {slogan}
                                            </span>
                                        </div>
                                    </div>
                                    <p className='slogan-content'>
                                        Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu.
                                        Nền tảng của chúng tôi giúp bạn dễ dàng tìm kiếm,
                                        ứng tuyển và quản lý sự nghiệp của mình.
                                    </p>
                                </div>


                                <div className="banner-item-select bg-white gap-5 rounded-lg shadow-md flex flex-wrap xl:flex-nowrap items-center justify-around p-4 w-full max-w-3xl"
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
                                    </select>

                                    {/* Combobox Địa điểm */}
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full xl:w-2/6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Chọn địa điểm</option>
                                        <option value="hanoi">Hà Nội</option>
                                        <option value="hcm">TP. Hồ Chí Minh</option>
                                        <option value="danang">Đà Nẵng</option>
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
                                <img className="imageBanner max-w-xs" src={imageBanner} alt="Banner" />
                            </div>

                        </div>
                    </div>

                    <div className='container-fluid container-fluid_categories'>

                        <div className="container-categories flex flex-wrap xl:flex-nowrap">
                            <div className='flex w-full align-middle justify-center flex-col'
                                style={{ paddingTop: 50, paddingBottom: 30 }}
                            >
                                <p style={{ fontSize: 34, padding: 30, fontWeight: "bolder" }}>Khám phá các cơ hội việc làm hàng đầu</p>
                                <p className='text-gray-600'>Tìm kiếm công việc mơ ước của bạn. Chúng tôi kết nối bạn với những nhà tuyển dụng hàng đầu.</p>
                            </div>

                            <div className="w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
                                    {categories.map((item, idx) => (
                                        <div className='categories-item bg-transparent'>
                                            <a href={item.url}>
                                                <div
                                                    key={idx}
                                                    className='item-bg'
                                                    style={{
                                                        backgroundImage: `url(${item.image})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                    }}
                                                >
                                                    <div className='categories-film'></div>
                                                    <FaArrowRight size={34} color='#fff' className='categories-icon'/>
                                                </div>
                                            </a>
                                            <div className='bg-white item-bottom'>
                                                <span className='item-title '>{item.name}</span>
                                                <span className='item-posted'>Posted:
                                                    <span className='bg-emerald-500'
                                                        style={{
                                                            color: '#fff', marginLeft: 10, padding: 5,
                                                            paddingLeft: 10, paddingRight: 10, borderRadius: 10, fontSize: 12
                                                        }}
                                                    >{item.posted}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className='container-fluid container-fluid_latest'>

                        <div className="container-lastest flex flex-wrap xl:flex-nowrap">
                            <div className='flex w-full align-middle justify-center flex-col'
                                style={{ paddingTop: 50, paddingBottom: 30 }}
                            >
                                <p className='text-gray-800' style={{ fontSize: 34, padding: 30, fontWeight: "bold" }}>Cơ Hội Không Thể Bỏ Lỡ</p>
                                <p className='text-gray-600'>Chúng tôi vừa thêm những cơ hội nghề nghiệp chất lượng dành cho bạn.</p>
                            </div>
                            <div className="w-full">

                                <div className="fillter-type flex items-center justify-center">
                                    <ul className='fillter-type_ul flex'>
                                        <li className='type-ul_li active'><a href="/">All</a></li>
                                        <li className='type-ul_li'><a href="/">Full Time</a></li>
                                        <li className='type-ul_li'><a href="/">Part Time</a></li>
                                        <li className='type-ul_li'><a href="/">Remote</a></li>
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                    {lastestJobs.map((item) => (
                                        <div className='lasted-item flex flex-col'>
                                            <div className='lasted-item_top flex justify-between'>

                                                <div className='item-top_left flex justify-around'>
                                                    <img src={item.image} className='lasted-item_image' />
                                                </div>

                                                <div className='item-top_center flex flex-col flex-1 text-left'>
                                                    <p className='lasted-item-nameJob' style={{ fontSize: 16, fontWeight: 'bold' }}>{item.nameJob}</p>

                                                    <div style={{ fontSize: 16, paddingTop: 5, paddingBottom: 10 }} className='lasted-item-department flex gap-4'>
                                                        <p className='text-gray-800'>
                                                            {item.department}
                                                        </p>
                                                        <span className='text-gray-600'>{getTimeAgo(item.postedAt!, item.updatedAt!)}</span>
                                                    </div>

                                                    <div className='flex gap-3 lasted-techs'>{item.tech.map((i) => (
                                                        <div className='lasted-tech-item'>
                                                            {i}
                                                        </div>
                                                    ))}</div>
                                                </div>

                                                <div className='item-top_right'>
                                                    <a href={item.url} className='btn-apply'>
                                                        Apply
                                                    </a>
                                                </div>
                                            </div>
                                            <div className='lasted-item_bottom'>

                                                <ul className='flex gap-6 flex-1'>
                                                    <li className='bottom-li flex gap-3 items-center'><IoLocationOutline /> {item.location}</li>
                                                    <li className='bottom-li flex gap-3 items-center'><FaRegMoneyBillAlt /> {item.salary}</li>
                                                    <li className='bottom-li flex gap-3 items-center'><AiOutlineClockCircle />{item.type}</li>
                                                    <li className='bottom-li flex gap-3 items-center'><RiContrastDrop2Line />{item.level}</li>
                                                </ul>

                                                <div
                                                    className={`cursor-pointer flex items-center gap-2 text-xl transition-transform duration-300 
                                                    ${item.animateSave ? "scale-125" : "scale-100"} 
                                                    ${item.isSaved ? "bg-emerald-600 text-white" : "text-gray-500 bg-gray-200"}`}
                                                    style={{ padding: 5, borderRadius: 5 }}
                                                    onClick={() => toggleSave(item.id)}
                                                >
                                                    <span style={{ fontSize: 12 }} className={`${item.isSaved ? "text-white" : "text-gray-500"}`}>{item.isSaved ? "Saved" : "Save"}</span>
                                                    {item.isSaved ? <FaBookmark color="#fff" size={14} /> : <FaRegBookmark color="gray" size={14} />}
                                                </div>

                                            </div>
                                        </div>
                                    ))}
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

export default Home;
