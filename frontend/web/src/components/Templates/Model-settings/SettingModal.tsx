import React, { useEffect, useState } from 'react';
import './SettingModal.css';
import Swal from 'sweetalert2';
import useUser from '../../../hook/useUser';
import useCV from '../../../hook/useCV';

// --- Interfaces Definitions ---
interface ContactInfo {
    phone: string;
    email: string;
    github: string;
    website: string;
    address: string;
}

interface Education {
    university: string;
    major: string;
    gpa: string;
    startYear: string;
    endYear: string;
}

interface Experience {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Project {
    projectName: string;
    projectDescription: string;
}

// Interface khớp với Mongoose Schema
interface CVData {
    name: string;
    title: string;
    introduction: string;
    professionalSkills: string;
    softSkills: string;
    experience: Experience[];
    certifications: string;
    activitiesAwards: string;
    contact: ContactInfo;
    education: Education[];
    projects: Project[];
    templateType: number;
    color: string;
    fontFamily: string;
    languageForCV: string;
}

export interface CustomSettings {
    color: string;
    fontFamily: string;
    lang: string;
}

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTemplate: 'twocolumns' | 'fresher' | 'modern';
    onTemplateChange: (template: 'twocolumns' | 'fresher' | 'modern') => void;
    customSettings: CustomSettings;
    onSettingsChange: (settings: Partial<CustomSettings>) => void;
    cvTemplateRef: React.RefObject<HTMLDivElement | null>;
    cvData: CVData;
    isEditMode?: boolean;
    cvId?: string | null;
    layoutOrder: string[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen, onClose,
    currentTemplate, onTemplateChange,
    customSettings, onSettingsChange,
    cvData,
    isEditMode = false,
    cvId = null,
    layoutOrder
}) => {
    const sidebarClasses = `settings-sidebar ${isOpen ? 'is-open' : ''}`;
    const [userId, setUserId] = useState<string>("");
    const { getUser, user } = useUser();
    const { createCV, updateCV } = useCV();

    // Lấy User ID từ LocalStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const idToFetch = parsed.user_id ?? parsed._id;
                getUser(idToFetch);
                setUserId(idToFetch);
            }
        } catch (e) {
            console.error("Invalid user data in localStorage", e);
        }
    }, [getUser]);

    const handleSaveCV = async () => {
        // 1. Validate dữ liệu cơ bản
        if (!cvData.name) return Swal.fire("Lỗi", "Vui lòng nhập tên của bạn.", "warning");
        console.log("Saving CV with data:", cvData, "and settings:", customSettings);
        // 2. Loading UI
        Swal.fire({
            title: isEditMode ? "Đang cập nhật..." : "Đang tạo CV...",
            html: "Hệ thống đang tạo bản in PDF...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            let result;

            // 3. Gọi Hook createCV hoặc updateCV
            if (isEditMode && cvId) {
                result = await updateCV(
                    cvId,
                    cvData,
                    customSettings,
                    layoutOrder
                );
            } else {
                result = await createCV(
                    user?._id || userId,
                    cvData,
                    customSettings,
                    layoutOrder
                );
            }

            // 4. Xử lý kết quả
            if (result) {
                const responseData = result as any;
                const pdfUrl = responseData.pdfUrl || (result.fileUrls && result.fileUrls[0]);

                Swal.fire({
                    title: "Thành công!",
                    text: "CV của bạn đã được xử lý.",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonText: "Xem & Tải PDF",
                    cancelButtonText: "Đóng",
                    confirmButtonColor: "#059669"
                }).then((swalRes) => {
                    if (swalRes.isConfirmed && pdfUrl) {
                        window.open(pdfUrl, '_blank');
                    }
                    onClose();
                });
            }

        } catch (error: any) {
            console.error("Save Error:", error);
            const msg = error.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại.";
            Swal.fire("Lỗi", msg, "error");
        }
    };

    return (
        <div className={sidebarClasses}>
            {/* Header */}
            <div className="modal-header">
                <h5>{isEditMode ? "Chỉnh Sửa CV" : "Tạo Mới CV"}</h5>
                <button className="close-button" onClick={onClose}>&times;</button>
            </div>

            {/* Template Selection */}
            <div className="setting-group template-switcher">
                <h3 className='text-left font-semibold mb-2'>1. Chọn Mẫu CV</h3>
                <div className="button-group flex flex-col gap-2">
                    <button
                        onClick={() => onTemplateChange('fresher')}
                        className={`p-2 border rounded ${currentTemplate === 'fresher' ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white'}`}
                    >
                        Fresher/Intern
                    </button>
                    {/* <button
                        onClick={() => onTemplateChange('twocolumns')}
                        className={`p-2 border rounded ${currentTemplate === 'twocolumns' ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white'}`}
                    >
                        Two Columns
                    </button>
                    <button
                        onClick={() => onTemplateChange('modern')}
                        className={`p-2 border rounded ${currentTemplate === 'modern' ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white'}`}
                    >
                        Modern
                    </button> */}
                </div>
            </div>

            {/* Styling */}
            <div className="setting-group customization mt-4">
                <h3 className='text-left font-semibold mb-2'>2. Kiểu Dáng</h3>
                <div className="setting-item flex justify-between items-center mb-2">
                    <span>Màu Chủ Đạo:</span>
                    <input
                        type="color"
                        value={customSettings.color}
                        onChange={(e) => onSettingsChange({ color: e.target.value })}
                        className="cursor-pointer"
                    />
                </div>

                <div className="setting-item flex justify-between items-center mb-2">
                    <span>Font Chữ:</span>
                    <select
                        value={customSettings.fontFamily}
                        onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
                        className="p-1 border rounded"
                    >
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="'Times New Roman', Times, serif">Times New Roman</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                    </select>
                </div>
            </div>

            {/* Language */}
            <div className="setting-group mt-4">
                <h3 className='text-left font-semibold mb-2'>3. Ngôn ngữ</h3>
                <div className="setting-item">
                    <select
                        value={customSettings.lang}
                        onChange={(e) => onSettingsChange({ lang: e.target.value })}
                        className="w-full p-1 border rounded"
                    >
                        <option value="vn">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end">
                <button
                    className="btn-create-cv px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors w-full font-bold"
                    onClick={handleSaveCV}
                >
                    {isEditMode ? "Lưu & Tải PDF" : "Tạo & Tải PDF"}
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;