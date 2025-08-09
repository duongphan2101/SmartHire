import React, { useState, useEffect } from 'react';

import './Home.css';
import Header from '../../components/Header/Header';
import ChatWithAI from '../../components/Chat-With-AI/ChatWithAI';
import Footer from '../../components/Footer/Footer';

import imageBanner from "../../assets/images/banner-21.png";

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

    return (
        <>
            <div className="App">
                <Header />
                <ChatWithAI />

                <div className="containerStyle">

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

                <Footer />
            </div>
        </>
    );
};

export default Home;
