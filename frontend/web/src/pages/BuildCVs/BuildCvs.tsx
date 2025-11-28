import React, { useEffect, useRef, useState } from "react";
import "./BuildCvs.css";

import SettingsModal from "../../components/Templates/Model-settings/SettingModal";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useUser, { type UserResponse } from "../../hook/useUser";
import Swal from "sweetalert2";
import FreshInternCVTemplate from "../../components/Templates/Template-1/SeniorCVTemplate";
import TwoColumnCVTemplate from "../../components/Templates/Template-2/TwoColumnCVTemplate";
import ModernCenteredCVTemplate from "../../components/Templates/Template-3/ModernCenteredCVTemplate";
import type { ChatRoom } from "../../utils/interfaces";
import ChatModal from "../../components/Chat/Chat";

type TemplateKey = 'twocolumns' | 'fresher' | 'modern';

interface ContactInfo {
    phone: string;
    email: string;
    github: string;
    website: string;
}

interface Experience {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Education {
    university: string;
    major: string;
    gpa: string;
    startYear: string;
    endYear: string;
}

interface Project {
    projectName: string;
    projectDescription: string;
}

interface CVData {
    name: string;
    introduction: string;
    experience: Experience[];
    professionalSkills: string;
    softSkills: string;
    certifications: string;
    activitiesAwards: string;
    contact: ContactInfo;
    education: Education[];
    projects: Project[];
    templateType: number;
}

interface CustomSettings {
    color: string;
    fontFamily: string;
    lang: string;
    // cvData: CVData;
}

const DEFAULT_CV_DATA: CVData = {
    name: "",
    introduction: "",
    professionalSkills: "",
    softSkills: "",
    experience: [{ company: "", description: "", endDate: "", jobTitle: "", startDate: "" },],
    certifications: "",
    activitiesAwards: "",
    contact: { phone: "", email: "", github: "", website: "" },
    education: [
        { university: "", major: "", gpa: "", startYear: "", endYear: "" },
    ],
    projects: [{ projectName: "", projectDescription: "" }],
    templateType: 1,
};

const BuildCvs: React.FC = () => {
    const [currentTemplate, setCurrentTemplate] = useState<TemplateKey>('fresher');
    const { getUser, user } = useUser();

    const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const [customSettings, setCustomSettings] = useState<CustomSettings>({
        color: '#059669',
        fontFamily: 'Arial',
        lang: 'vn',
        // cvData: cvData
    });
    // const [, setOriginalData] = useState<CVData>({ ...cvData });
    const cvTemplateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    const idToFetch = parsed.user_id ?? parsed._id;
                    getUser(idToFetch);

                    const template = { 'twocolumns': 2, 'fresher': 1, 'modern': 3 }[currentTemplate];

                    const userData: UserResponse | void = await getUser(idToFetch);
                    if (userData) {
                        setCvData((prev) => ({
                            ...prev,
                            name: userData.fullname || "",
                            contact: {
                                ...prev.contact,
                                phone: userData.phone || "",
                                email: userData.email || "",
                            },
                            templateType: template
                        }));
                        // setOriginalData((prev) => ({
                        //     ...prev,
                        //     name: userData.fullname || "",
                        //     contact: {
                        //         ...prev.contact,
                        //         phone: userData.phone || "",
                        //         email: userData.email || "",
                        //     },
                        // }));
                    }
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Bạn cần đăng nhập",
                        text: "Vui lòng đăng nhập để tiếp tục!",
                        showCancelButton: true,
                        confirmButtonText: "Đăng nhập",
                        cancelButtonText: "Hủy",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "/login";
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            window.location.href = "/home";
                        }
                    });
                }
            } catch (e) {
                console.error("Invalid user data in localStorage", e);
                Swal.fire({
                    icon: "error",
                    title: "Lỗi dữ liệu",
                    text: "Thông tin đăng nhập không hợp lệ. Vui lòng đăng nhập lại!",
                    showCancelButton: true,
                    confirmButtonText: "Đăng nhập",
                    cancelButtonText: "Hủy",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/login";
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        window.location.href = "/home";
                    }
                });
            }
        };

        fetchUserData();
    }, [getUser]);

    useEffect(() => {
        if (user && user.fullname !== undefined) {
            const initialData: CVData = {
                ...DEFAULT_CV_DATA,
                name: user.fullname || "",
                contact: {
                    ...DEFAULT_CV_DATA.contact,
                    phone: user.phone || "",
                    email: user.email || "",
                },
                templateType: { 'twocolumns': 2, 'fresher': 1, 'modern': 3 }[currentTemplate]
            };

            setCvData(initialData);
            // setCustomSettings(prevSettings => ({
            //     ...prevSettings,
            //     cvData: initialData
            // }));
        }
    }, [user]);

    const handleTemplateChange = (templateType: TemplateKey) => {
        setCurrentTemplate(templateType);
    };

    const handleSettingsChange = (newSettings: Partial<CustomSettings>) => {
        setCustomSettings(prevSettings => ({
            ...prevSettings,
            ...newSettings
        }));
    };

    const updateCvData = (field: keyof CVData, value: any) => {
        const updatedData = {
            ...cvData,
            [field]: value
        };

        setCvData(updatedData);

        // Đảm bảo customSettings luôn đồng bộ
        // setCustomSettings(prevSettings => ({
        //     ...prevSettings,
        //     cvData: updatedData
        // }));
    };

    const renderTemplateComponent = () => {
        const commonProps = {
            ref: cvTemplateRef,
            settings: customSettings,
            cvData: cvData,
            updateCvData: updateCvData,
        };

        switch (currentTemplate) {
            case 'fresher':
                return <FreshInternCVTemplate {...commonProps} />;
            case 'twocolumns':
                return <TwoColumnCVTemplate {...commonProps} />;
            case 'modern':
                return <ModernCenteredCVTemplate {...commonProps} />;
            default:
                return <FreshInternCVTemplate {...commonProps} />;
        }
    };

    const contentClasses = `buildcv-content ${isModalOpen ? 'modal-open' : ''}`;

    const [openChat, setIsChatOpen] = useState(false);
    const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null);

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
        <div className="buildcv-app">
            <Header onOpenChat={handleOpenChatRequest} />

            {openChat && (
                <ChatModal room={currentChatRoom} onClose={handleCloseChat} />
            )}

            <div className={contentClasses}>
                <div className="buildcv-toolbar shadow-2xl">
                    <button
                        className="open-close-toolbar-button"
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        title={isModalOpen ? "Đóng Tùy chỉnh" : "Mở Tùy chỉnh"}
                    >
                        {isModalOpen ? '✖' : '🎨'}
                    </button>

                    <SettingsModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        currentTemplate={currentTemplate}
                        onTemplateChange={handleTemplateChange}
                        customSettings={customSettings}
                        onSettingsChange={handleSettingsChange}
                        cvTemplateRef={cvTemplateRef}
                        cvData={cvData}
                    />
                </div>

                <div className="buildcv-content-page">
                    <div className="content-page-template">
                        {renderTemplateComponent()}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BuildCvs;