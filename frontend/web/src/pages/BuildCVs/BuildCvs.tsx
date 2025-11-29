import React, { useEffect, useRef, useState } from "react";
import "./BuildCvs.css";

import SettingsModal from "../../components/Templates/Model-settings/SettingModal";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useUser from "../../hook/useUser";
import Swal from "sweetalert2";
import FreshInternCVTemplate from "../../components/Templates/Template-1/SeniorCVTemplate";
import TwoColumnCVTemplate from "../../components/Templates/Template-2/TwoColumnCVTemplate";
import ModernCenteredCVTemplate from "../../components/Templates/Template-3/ModernCenteredCVTemplate";
import type { ChatRoom } from "../../utils/interfaces";
import ChatModal from "../../components/Chat/Chat";
import { useSearchParams } from "react-router-dom";
import { HOSTS } from "../../utils/host";

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
    });
    
    // Lấy ID từ URL
    const [searchParams] = useSearchParams();
    const cvIdToEdit = searchParams.get("id");
    
    const cvTemplateRef = useRef<HTMLDivElement>(null);

    // Helper chuyển đổi số type sang tên template
    const getTemplateKeyFromNumber = (type: number): TemplateKey => {
        switch (type) {
            case 2: return 'twocolumns';
            case 3: return 'modern';
            default: return 'fresher';
        }
    };

    // UseEffect 1: Load User (chỉ dùng để check login)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    const idToFetch = parsed.user_id ?? parsed._id;
                    getUser(idToFetch);
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
            }
        };

        fetchUserData();
    }, [getUser]);

    useEffect(() => {
        const initData = async () => {
            if (cvIdToEdit) {
                try {
                    const response = await fetch(`${HOSTS.cvService}/cv/${cvIdToEdit}`);
                    
                    if (!response.ok) {
                        throw new Error("Không thể tải dữ liệu CV");
                    }
    
                    const data = await response.json();
    
                    const mappedData: CVData = {
                        name: data.name || "",
                        introduction: data.introduction || "",
                        professionalSkills: data.professionalSkills || "",
                        softSkills: data.softSkills || "",
                        certifications: data.certifications || "",
                        activitiesAwards: data.activitiesAwards || "",
                        
                        contact: {
                            phone: data.contact?.phone || "",
                            email: data.contact?.email || "",
                            github: data.contact?.github || "",
                            website: data.contact?.website || "",
                        },
    
                        experience: Array.isArray(data.experience) 
                            ? data.experience.map((exp: any) => ({
                                jobTitle: exp.jobTitle || "",
                                company: exp.company || "",
                                startDate: exp.startDate || "",
                                endDate: exp.endDate || "",
                                description: exp.description || "",
                            }))
                            : [],
    
                        education: Array.isArray(data.education)
                            ? data.education.map((edu: any) => ({
                                university: edu.university || "",
                                major: edu.major || "",
                                gpa: edu.gpa || "",
                                // Xử lý map field 'year' của backend vào startYear
                                startYear: edu.startYear || edu.year || "", 
                                endYear: edu.endYear || "",
                            }))
                            : [],
    
                        projects: Array.isArray(data.projects)
                            ? data.projects.map((proj: any) => ({
                                projectName: proj.projectName || "",
                                projectDescription: proj.projectDescription || "",
                            }))
                            : [],
    
                        templateType: data.templateType || 1,
                    };
    
                    setCvData(mappedData);
                    setCurrentTemplate(getTemplateKeyFromNumber(data.templateType));
    
                } catch (error) {
                    console.error("Error fetching CV:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Lỗi",
                        text: "Không thể tải nội dung CV để chỉnh sửa.",
                    });
                }
            } 
            else if (user && user.fullname) {
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
            }
        };

        initData();
    }, [cvIdToEdit, user]);

    const handleTemplateChange = (templateType: TemplateKey) => {
        setCurrentTemplate(templateType);
        const typeNum = { 'twocolumns': 2, 'fresher': 1, 'modern': 3 }[templateType];
        setCvData(prev => ({ ...prev, templateType: typeNum }));
    };

    const handleSettingsChange = (newSettings: Partial<CustomSettings>) => {
        setCustomSettings(prevSettings => ({
            ...prevSettings,
            ...newSettings
        }));
    };

    const updateCvData = (field: keyof CVData, value: any) => {
        setCvData(prev => ({
            ...prev,
            [field]: value
        }));
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
                        isEditMode={!!cvIdToEdit}
                        cvId={cvIdToEdit}
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