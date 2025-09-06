import React, { useState, useEffect } from "react";

import './JobDetails.css';
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import apple from "../../assets/images/apple.png";
import google from "../../assets/images/google.png";
import nike from "../../assets/images/nike.png";
import stabuck from "../../assets/images/starbuck.png";
import volkswagen from "../../assets/images/volkswagen.png";
import meta from "../../assets/images/meta.png";
import { fetchProvinces, type Province } from "../../utils/provinceApi";
import { BsFilter } from 'react-icons/bs';
import Detail from "../../components/Detail-Job/Detail";

const JobDetails: React.FC = () => {

    const [jobTitle, setJobTitle] = useState("");
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [location, setLocation] = useState("");
    const [selectedJob, setSelectedJob] = useState<any | null>(null);


    useEffect(() => {
        fetchProvinces().then(setProvinces);
    }, []);

    const handleSearch = () => {
        alert(`Tìm kiếm: ${jobTitle} tại ${location}`);
    };

    const lastest = [
        {
            id: 1,
            nameJob: "iOS Developer",
            department: "Apple",
            image: apple,
            tech: ["Objective-C", "Swift", "XCode"],
            url: "/jobdetail",
            location: "Hanoi",
            address: "Apple Store, 25 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội, Việt Nam",
            salary: "$1,200 - $1,800",
            level: "Fresher",
            type: "Full-time",
            postedAt: "2025-08-13T10:00:00Z",
            updatedAt: "2025-08-14T13:04:00Z",
            isSaved: false,
            about: "You will work on designing and developing iOS applications for Apple's ecosystem, focusing on high performance and seamless user experiences.",
            responsibilities: [
                "Develop and maintain iOS applications using Swift and Objective-C",
                "Collaborate with designers and backend developers",
                "Optimize applications for performance and responsiveness",
                "Participate in code reviews and provide constructive feedback"
            ],
            requirements: [
                "Bachelor’s degree in Computer Science or related field",
                "Knowledge of Swift, Objective-C, and iOS frameworks",
                "Familiarity with Xcode and iOS design principles",
                "Good problem-solving and teamwork skills"
            ],
            benefits: [
                "13th month salary and performance bonus",
                "Health insurance and annual health check",
                "MacBook provided",
                "Team building activities"
            ],
            workingHours: "Mon - Fri, 9:00 AM - 6:00 PM"
        },
        {
            id: 2,
            nameJob: "Frontend Developer",
            department: "Google",
            image: google,
            tech: ["HTML", "CSS", "JavaScript"],
            url: "/",
            location: "Ho Chi Minh City",
            address: "Google Asia Pacific, Nguyễn Văn Bảo/12 Đ. Hạnh Thông, Phường, Gò Vấp, Hồ Chí Minh 700000, Việt Nam",
            salary: "$1,000 - $1,500",
            level: "Junior",
            type: "Hybrid",
            postedAt: "2025-08-10T08:30:00Z",
            updatedAt: null,
            isSaved: false,
            about: "Join Google's frontend team to create interactive, scalable, and user-friendly web applications.",
            responsibilities: [
                "Implement responsive UI with HTML, CSS, and JavaScript",
                "Work closely with designers and backend engineers",
                "Ensure cross-browser and cross-device compatibility",
                "Optimize application for speed and performance"
            ],
            requirements: [
                "Solid understanding of HTML, CSS, JavaScript",
                "Experience with modern frontend frameworks (React, Vue, Angular is a plus)",
                "Basic knowledge of REST APIs",
                "Good communication and teamwork"
            ],
            benefits: [
                "Flexible working schedule",
                "Free lunch and snacks",
                "Health & dental insurance",
                "Training budget"
            ],
            workingHours: "Mon - Fri, 10:00 AM - 7:00 PM"
        },
        {
            id: 3,
            nameJob: "Backend Developer",
            department: "Starbucks",
            image: stabuck,
            tech: ["Node.js", "Express", "MongoDB"],
            url: "/",
            location: "Da Nang",
            address: "Starbucks Da Nang, 63 Bạch Đằng, Hải Châu, Đà Nẵng, Việt Nam",
            salary: "$1,500 - $2,000",
            level: "Senior",
            type: "Onsite",
            postedAt: "2025-08-12T15:00:00Z",
            updatedAt: "2025-08-14T09:00:00Z",
            isSaved: false,
            about: "Work on building and maintaining backend services that power Starbucks' digital platforms.",
            responsibilities: [
                "Design and develop RESTful APIs",
                "Integrate backend with databases (MongoDB, SQL)",
                "Maintain security and data protection standards",
                "Mentor junior developers and review code"
            ],
            requirements: [
                "Strong experience with Node.js and Express",
                "Proficiency in MongoDB and database design",
                "Understanding of authentication and authorization (JWT, OAuth)",
                "5+ years of backend development experience"
            ],
            benefits: [
                "Free coffee & beverages",
                "Annual performance bonus",
                "Comprehensive healthcare package",
                "International working environment"
            ],
            workingHours: "Mon - Fri, 8:30 AM - 5:30 PM"
        },
        {
            id: 4,
            nameJob: "Mobile App Developer",
            department: "Volkswagen",
            image: volkswagen,
            tech: ["Java", "Kotlin", "Android Studio"],
            url: "/",
            location: "Hanoi",
            address: "Volkswagen Showroom, 123 Láng Hạ, Đống Đa, Hà Nội, Việt Nam",
            salary: "$1,000 - $1,700",
            level: "Fresher",
            type: "Remote",
            postedAt: "2025-08-08T10:00:00Z",
            updatedAt: null,
            isSaved: false,
            about: "Volkswagen is looking for enthusiastic mobile developers to contribute to Android applications for connected car services.",
            responsibilities: [
                "Develop Android apps using Java and Kotlin",
                "Work with APIs and cloud integration",
                "Fix bugs and improve application performance",
                "Collaborate with the UX/UI design team"
            ],
            requirements: [
                "Bachelor’s degree in IT or related field",
                "Familiarity with Android SDK and Android Studio",
                "Basic understanding of RESTful APIs",
                "Eagerness to learn and grow in a professional environment"
            ],
            benefits: [
                "Remote work allowance",
                "Online training courses",
                "Health insurance after probation",
                "Annual company trip"
            ],
            workingHours: "Flexible hours, expected 40h/week"
        },
        {
            id: 5,
            nameJob: "UI/UX Designer",
            department: "Nike",
            image: nike,
            tech: ["Figma", "Adobe XD", "Sketch"],
            url: "/",
            location: "Ho Chi Minh City",
            address: "Nike Store, 25 Lê Lợi, Quận 1, TP. HCM, Việt Nam",
            salary: "$900 - $1,400",
            level: "Intern",
            type: "Part-time",
            postedAt: "2025-08-11T14:00:00Z",
            updatedAt: "2025-08-14T06:00:00Z",
            isSaved: false,
            about: "As a UI/UX Designer Intern at Nike, you will help design intuitive digital experiences for millions of users worldwide.",
            responsibilities: [
                "Assist in creating wireframes, prototypes, and user flows",
                "Support senior designers in product design tasks",
                "Participate in user research and usability testing",
                "Ensure consistent branding and design standards"
            ],
            requirements: [
                "Familiarity with design tools such as Figma, Adobe XD, or Sketch",
                "Basic understanding of UX principles",
                "Creative mindset with attention to detail",
                "Good communication and teamwork"
            ],
            benefits: [
                "Part-time flexible schedule",
                "Mentorship from senior designers",
                "Networking opportunities",
                "Access to premium design tools"
            ],
            workingHours: "20h/week, flexible arrangement"
        },
        {
            id: 6,
            nameJob: "Fullstack Developer",
            department: "Meta",
            image: meta,
            tech: ["React", "Node.js", "GraphQL"],
            url: "/",
            location: "Da Nang",
            address: "Meta Office, 60 Bạch Đằng, Hải Châu, Đà Nẵng, Việt Nam",
            salary: "$1,800 - $2,500",
            level: "Senior",
            type: "Full-time",
            postedAt: "2025-08-09T09:00:00Z",
            updatedAt: null,
            isSaved: false,
            about: "Work on end-to-end development of Meta’s web applications, from frontend to backend.",
            responsibilities: [
                "Build scalable web applications with React and Node.js",
                "Design APIs and integrate with GraphQL services",
                "Maintain high code quality through testing and reviews",
                "Collaborate with cross-functional teams"
            ],
            requirements: [
                "Strong experience with React and Node.js",
                "Good knowledge of GraphQL and REST APIs",
                "Experience with CI/CD pipelines",
                "5+ years of fullstack development experience"
            ],
            benefits: [
                "High salary & stock options",
                "Comprehensive healthcare package",
                "Free gym membership",
                "Annual learning budget"
            ],
            workingHours: "Mon - Fri, 9:00 AM - 6:00 PM"
        }
    ];


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

    const handlerJobItem = (id: string) => {
        const job = lastest.find((item) => item.id.toString() === id);
        setSelectedJob(job || null);
    };


    return (
        <>
            <div className="App">
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
                                <option value="intern frontend">Intern Frontend</option>
                                <option value="intern backend">Intern Backend</option>
                                <option value="intern designer">Intern UI/UX Designer</option>
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
                                            Fillters
                                        </button>
                                    </div>

                                    <div className="head-left-main flex flex-col w-full">
                                        {lastest.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`job-item flex items-center gap-5 cursor-pointer`}
                                                onClick={() => handlerJobItem(item.id.toString())}
                                            >
                                                <div className="bg-gray-200"
                                                    style={{ borderRadius: 5, padding: 5 }}
                                                >
                                                    <img className="job-item-image" src={item.image} />
                                                </div>
                                                <div className="flex flex-col gap-2 text-left flex-2/4">
                                                    <span style={{ fontWeight: 'bold' }}>{item.nameJob}</span>
                                                    <div className="flex gap-5">
                                                        <span className="text-gray-500">{item.department}</span>
                                                        <span className="text-gray-500">{getTimeAgo(item.postedAt!, item.updatedAt!)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 text-center flex-1/4">
                                                    <span>{item.level}</span>
                                                    <span>{item.type}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-6 md:col-span-6">
                                <div className="head-card">
                                    {(selectedJob || lastest[0]) ? (
                                        <Detail item={selectedJob || lastest[0]} />
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
}

export default JobDetails;