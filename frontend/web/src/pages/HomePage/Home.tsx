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

// import { FaArrowRight } from 'react-icons/fa';

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
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 w-full">
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
                                                    <div className='categories-film'>
                                                        {/* <FaArrowRight color='#fff' size={34} /> */}
                                                    </div>
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


                </div>

                <Footer />
            </div>
        </>
    );
};

export default Home;
