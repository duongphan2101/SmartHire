import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import './Profile.css';
import { FaEdit, FaGithub } from 'react-icons/fa';
import { AiOutlineRadarChart } from "react-icons/ai";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useUser from "../../hook/useUser";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { Select, Switch, Button } from "antd"; // Import Button từ antd
import { TbWorld } from "react-icons/tb";
import useCV, { type CVAnalysisData, type CVResponse } from "../../hook/useCV";
import type { ChatRoom } from "../../utils/interfaces";
import ChatModal from "../../components/Chat/Chat";
import CVViewer from "../../components/Preview-PDF/PdfPreview";
import CVAnalysisPanel from "./AnanysisCV";
import { AiOutlineRobot, AiOutlineClose, AiOutlineArrowDown } from "react-icons/ai";

const Profile: React.FC = () => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { getUser, user, updateUser, updateUserAvatar } = useUser();
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [userDob, setUserDob] = useState<string>('');
    const [userPhone, setUserPhone] = useState<string>('');
    const MySwal = withReactContent(Swal);

    const [userId, setUserId] = useState<string>('');
    const [jobStatus, setJobStatus] = useState<string>('');
    const { getCVs, cvs, loadingCV, analyzeCV } = useCV();
    const [, setContent] = useState<CVAnalysisData>();
    const [selectedCV, setSelectedCV] = useState<CVResponse>();
    const [selectedCvObject, setSelectedCvObject] = useState<{ value: string; label: React.ReactNode } | undefined>(undefined);
    const [isAnalyzed, setIsAnalyzed] = useState(false);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const idToFetch = parsed.user_id ?? parsed._id;
                setUserId(idToFetch);
                if (idToFetch) {
                    getUser(idToFetch);
                    getCVs(idToFetch);
                }
            }
        } catch (e) {
            console.error("Invalid user data in localStorage", e);
        }
    }, [getUser]);

    useEffect(() => {
        if (user) {
            setUserName(user.fullname || "");
            setUserEmail(user.email || "");
            setUserDob(user.dob ? user.dob.split("T")[0] : "");
            setUserPhone(user.phone || "");
            setJobStatus(user.status || "inactive");
        }
    }, [user]);

    const handleSaveChanges = async () => {
        if (userId) {
            try {
                Swal.fire({
                    title: "Đang cập nhật...",
                    text: "Vui lòng chờ trong giây lát",
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); },
                });

                await updateUser(userId, {
                    fullname: userName,
                    email: userEmail,
                    phone: userPhone,
                    dob: userDob,
                });

                Swal.fire({
                    icon: "success",
                    title: "Thành công!",
                    text: "Cập nhật hồ sơ thành công.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
                });
            }
        }
    };

    const handleEditAvatar = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        try {
            MySwal.fire({
                title: "Đang cập nhật...",
                text: "Vui lòng chờ trong giây lát",
                didOpen: () => { MySwal.showLoading(); },
                allowOutsideClick: false,
            });

            const imageUrl = await uploadToCloudinary(file);
            const res = await updateUserAvatar(userId, imageUrl);

            if (res) {
                await MySwal.fire({
                    title: "Thành công!",
                    text: "Cập nhật ảnh đại diện thành công!",
                    icon: "success",
                    confirmButtonText: "Xác nhận",
                });
            } else {
                throw new Error("No response from server");
            }
        } catch (err) {
            console.error("Update avatar error:", err);
            await MySwal.fire({
                title: "Thất bại!",
                text: "Có lỗi xảy ra khi cập nhật ảnh đại diện.",
                icon: "error",
                confirmButtonText: "Thử lại",
            });
        } finally {
            e.target.value = "";
        }
    };

    const statusConfig = {
        active: { text: "Tìm việc", className: "status-active" },
        inactive: { text: "Không tìm việc", className: "status-inactive" },
        banned: { text: "Bị khóa", className: "status-banned" }
    };

    const currentStatus = jobStatus as keyof typeof statusConfig || "inactive";
    const display = statusConfig[currentStatus] || statusConfig.inactive;

    const onChangeUserStatus = async (checked: boolean) => {
        const newStatus = checked ? "active" : "inactive";
        setJobStatus(newStatus);
        if (userId) {
            try {
                await updateUser(userId, { status: newStatus });
                MySwal.fire({
                    title: "Đã cập nhật trạng thái!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end',
                });
            } catch (err) {
                setJobStatus(checked ? "inactive" : "active");
                MySwal.fire({
                    title: "Lỗi!",
                    text: "Không thể cập nhật trạng thái.",
                    icon: "error"
                });
            }
        }
    };

    useEffect(() => {
        if (cvs && cvs.length > 0) {
            const firstCv = cvs[0];
            setSelectedCV(firstCv);
            setSelectedCvObject({ value: firstCv._id, label: firstCv.name });
        } else {
            setSelectedCV(undefined);
            setSelectedCvObject(undefined);
        }
    }, [cvs]);

    const handleChange = async (value: { value: string; label: React.ReactNode }) => {
        setSelectedCvObject(value);
        const selected = cvs.find(cv => cv._id === value.value);
        setSelectedCV(selected);
        const data = await analyzeCV(selected?._id ?? "");
        setContent(data ?? undefined);
    };

    const cvOptions = cvs.map(cv => ({ value: cv._id, label: cv.name }));

    const getPdfUrl = () => {
        if (!selectedCV || !selectedCV.fileUrls) return null;
        if (Array.isArray(selectedCV.fileUrls) && selectedCV.fileUrls.length > 0) return selectedCV.fileUrls[0];
        if (typeof selectedCV.fileUrls === 'string') return selectedCV.fileUrls;
        return null;
    };

    const pdfUrl = getPdfUrl();
    const [openChat, setIsChatOpen] = useState(false);
    const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null);

    const handleOpenChatRequest = (room?: ChatRoom) => {
        if (room) setCurrentChatRoom(room);
        setIsChatOpen(true);
    };

    const handleCloseChat = () => setIsChatOpen(false);


    return (
        <div className="profile-container bg-gray-50">
            <Header onOpenChat={handleOpenChatRequest} />

            {openChat && (<ChatModal room={currentChatRoom} onClose={handleCloseChat} />)}

            <div className="profile-content">
                <ul className="profile-nav flex gap-2" style={{ padding: '10px' }}>
                    <li className="profile-nav_item text-blue-400"><a href="/home">Trang chủ</a></li>
                    <li className="profile-nav_item text-blue-400">/</li>
                    <li className="profile-nav_item text-gray-400"><a href="">Hồ sơ</a></li>
                </ul>

                {/* --- PHẦN THÔNG TIN CÁ NHÂN --- */}
                <div className="profile-details flex flex-wrap xl:flex-nowrap" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 w-full">
                        {/* Trái 40% - Avatar & Status */}
                        <div className="lg:col-span-2">
                            <div className="profile-left flex flex-col items-center gap-4">
                                <div className="profile-card_avatar w-full bg-white p-4 flex flex-col items-center rounded-lg shadow-md" style={{ padding: '20px' }}>
                                    <div className="profile-avatar_container">
                                        <div className="avtar-edit" onClick={handleEditAvatar}>
                                            <FaEdit size={24} color="#fff" />
                                        </div>
                                        <div className="">
                                            <div className={`box-userStatus shadow-2xl ${display.className}`}>
                                                <span>{display.text}</span>
                                            </div>
                                            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
                                            <img src={user?.avatar} alt="User Avatar" className="profile-avatar" />
                                        </div>
                                    </div>
                                    <p className="text-2xl" style={{ fontWeight: 'bold' }}>{user?.fullname}</p>
                                </div>

                                <div className="profile-card_link w-full bg-white flex flex-col items-center rounded-lg shadow-md" style={{ padding: '5px' }}>
                                    <ul className="card-link_list w-full flex flex-col gap-1.5">
                                        <li className="card-link_item">
                                            <span><AiOutlineRadarChart size={24} color="#3b82f6" /> Trạng thái tìm việc</span>
                                            <Switch
                                                checked={jobStatus === "active"}
                                                onChange={onChangeUserStatus}
                                                disabled={jobStatus === "banned"}
                                                style={{ backgroundColor: jobStatus === "active" ? '#059669' : undefined }}
                                            />
                                        </li>
                                        <li className="card-link_item">
                                            <span><TbWorld size={22} color="#3b82f6" /> Website</span>
                                            <a href="/" className="link_item_link">/myweb.vercel.com</a>
                                        </li>
                                        <li className="card-link_item">
                                            <span><FaGithub size={22} /> Github</span>
                                            <a href="/" className="link_item_link">/mygithub.github.io</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Phải 60% - Form thông tin */}
                        <div className="lg:col-span-4">
                            <div className="profile-right flex flex-col items-center gap-4">
                                <div className="profile-card_about w-full bg-white p-4 rounded-lg shadow-md flex flex-col gap-10">
                                    <div className="group">
                                        <input type="text" className="input" required value={userName} onChange={(e) => setUserName(e.target.value)} />
                                        <span className="highlight"></span><span className="bar"></span><label>Họ Tên</label>
                                    </div>
                                    <div className="group">
                                        <input type="text" className="input" required value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                                        <span className="highlight"></span><span className="bar"></span><label>Email</label>
                                    </div>
                                    <div className="group">
                                        <input type="date" className="input" required value={userDob} onChange={(e) => setUserDob(e.target.value)} placeholder="YYYY-MM-DD" />
                                        <span className="highlight"></span><span className="bar"></span><label>Ngày sinh</label>
                                    </div>
                                    <div className="group">
                                        <input type="text" className="input" required value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
                                        <span className="highlight"></span><span className="bar"></span><label>Số điện thoại</label>
                                    </div>
                                    <button className="button" onClick={handleSaveChanges}>Lưu thay đổi</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PHẦN CV  --- */}
                <div className="profile-details w-full" style={{ paddingBottom: '20px' }}>

                    <div
                        className="flex flex-col w-full gap-4 transition-all duration-500 ease-in-out"
                        style={{ height: 'auto' }} // Chiều cao tổng cố định
                    >

                        {/* --- PHẦN 1 (TRÊN): CV VIEWER --- */}
                        <div
                            className="flex-shrink-0 flex flex-col gap-3 transition-all duration-500 ease-in-out bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            style={{
                                height: isAnalyzed ? '40%' : '100%',
                                padding: '16px',
                            }}
                        >
                            {/* Toolbar: Select CV & Nút Phân tích */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 flex-1">
                                    <span className="font-bold whitespace-nowrap text-gray-700">Chọn CV: </span>
                                    <Select
                                        labelInValue
                                        value={selectedCvObject}
                                        style={{ width: '100%', maxWidth: '400px' }}
                                        onChange={handleChange}
                                        options={cvOptions}
                                        loading={loadingCV}
                                        disabled={loadingCV}
                                        placeholder="Vui lòng chọn CV..."
                                    />
                                </div>

                                {/* Nút Kích hoạt */}
                                {!isAnalyzed && (
                                    <Button
                                        type="primary"
                                        size="large"
                                        disabled={!pdfUrl}
                                        onClick={() => setIsAnalyzed(true)}
                                        style={{ backgroundColor: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <AiOutlineRobot size={20} /> AI Phân Tích
                                    </Button>
                                )}
                            </div>

                            {/* Viewer Wrapper */}
                            <div className="relative flex-1 w-full border border-gray-200 rounded-lg overflow-hidden bg-white"
                                style={{ height: 'fit-content', padding: '10px' }}
                            >
                                {pdfUrl ? (
                                    <div
                                        style={{
                                            width: "350px",
                                            height: "550px",
                                            overflow: "hidden",
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "8px",
                                            margin: '0 auto'
                                        }}
                                    >
                                        <CVViewer pdfUrl={pdfUrl} />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <p>Không có file PDF để hiển thị.</p>
                                    </div>
                                )}

                                {/* Nút nhỏ để mở rộng lại nếu đang bị thu nhỏ */}
                                {isAnalyzed && (
                                    <div
                                        className="absolute bottom-2 right-2 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 border border-gray-200"
                                        onClick={() => setIsAnalyzed(false)}
                                        title="Xem toàn màn hình"
                                    >
                                        <AiOutlineArrowDown size={20} color="#555" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- PHẦN 2 (DƯỚI): ANALYSIS PANEL --- */}
                        {/* Chiếm 0% khi chưa phân tích, 60% khi đã phân tích (Trượt từ dưới lên) */}
                        <div
                            className="flex-shrink-0 transition-all duration-500 ease-in-out bg-white rounded-lg shadow-[0_-5px_15px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden flex flex-col"
                            style={{
                                height: isAnalyzed ? '60%' : '0%',
                                opacity: isAnalyzed ? 1 : 0,
                                marginTop: isAnalyzed ? '0' : '-10px',
                                padding: isAnalyzed ? '16px' : '0',
                            }}
                        >
                            {/* Header Panel */}
                            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                                    <AiOutlineRobot size={22} />
                                    <span>Kết quả phân tích từ AI</span>
                                </div>
                                <button
                                    onClick={() => setIsAnalyzed(false)}
                                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                    title="Đóng kết quả"
                                >
                                    <AiOutlineClose size={20} />
                                </button>
                            </div>

                            {/* Content (Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-2 bg-white">
                                <CVAnalysisPanel
                                    cvId={selectedCV?._id}
                                    // Callback này dùng để trigger lại nếu cần thiết
                                    onStartAnalysis={() => setIsAnalyzed(true)}
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default Profile;