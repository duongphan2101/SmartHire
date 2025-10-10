import React, { useEffect, useRef, useState } from "react";
import "./BuildCvs.css";

import TemplateFresher from "../../components/Templates/Template-1/SeniorCVTemplate";
import SettingsModal from "../../components/Templates/Model-settings/SettingModal";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useUser from "../../hook/useUser";

type TemplateKey = 'senior' | 'fresher';

interface ContactInfo {
    phone: string;
    email: string;
    github: string;
    website: string;
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
    professionalSkills: string;
    softSkills: string;
    experience: string;
    certifications: string;
    activitiesAwards: string;
    contact: ContactInfo;
    education: Education[];
    projects: Project[];
}

interface CustomSettings {
    color: string;
    fontFamily: string;
    cvData: CVData;
}

const DEFAULT_CV_DATA: CVData = {
    name: "",
    introduction: "",
    professionalSkills: "",
    softSkills: "",
    experience: "",
    certifications: "",
    activitiesAwards: "",
    contact: { phone: "", email: "", github: "", website: "" },
    education: [
        { university: "", major: "", gpa: "", startYear: "", endYear: "" },
    ],
    projects: [{ projectName: "", projectDescription: "" }],
};

const BuildCvs: React.FC = () => {
    const [currentTemplate, setCurrentTemplate] = useState<TemplateKey>('fresher');
    const { getUser, user } = useUser();
    
    const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [customSettings, setCustomSettings] = useState<CustomSettings>({
        color: '#059669',
        fontFamily: 'Arial',
        cvData: cvData
    });

    const cvTemplateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const idToFetch = parsed.user_id ?? parsed._id;
                getUser(idToFetch);
            }
        } catch (e) {
            console.error("Invalid user data in localStorage", e);
        }
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
                }
            };
            
            setCvData(initialData);
            setCustomSettings(prevSettings => ({
                ...prevSettings,
                cvData: initialData
            }));
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
        setCustomSettings(prevSettings => ({
            ...prevSettings,
            cvData: updatedData
        }));
    };

    const renderTemplateComponent = () => {
        return (
            <TemplateFresher 
                ref={cvTemplateRef} 
                settings={customSettings} 
                cvData={cvData} 
                updateCvData={updateCvData} 
            />
        );
    };

    const contentClasses = `buildcv-content ${isModalOpen ? 'modal-open' : ''}`;

    return (
        <div className="buildcv-app">
            <Header />

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