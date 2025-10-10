import React, { useEffect, useState } from 'react';
import './SettingModal.css';
import useCV from "../../../hook/useCV";
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import useUser from '../../../hook/useUser';
import { uploadPDF } from '../../../utils/uploadPDF';

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

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTemplate: 'senior' | 'fresher';
    onTemplateChange: (template: 'senior' | 'fresher') => void;
    customSettings: CustomSettings;
    onSettingsChange: (settings: Partial<CustomSettings>) => void;
    cvTemplateRef: React.RefObject<HTMLDivElement | null>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen, onClose,
    currentTemplate, onTemplateChange,
    customSettings, onSettingsChange,
    cvTemplateRef
}) => {
    const { cvData } = customSettings;
    const sidebarClasses = `settings-sidebar ${isOpen ? 'is-open' : 'is-open'}`;
    const { createCV } = useCV();
    const [userId, setUserId] = useState<string>("");
    const { getUser } = useUser();
    
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

    const handleCreateCV = async () => {
        const element = cvTemplateRef.current; 
        if (!element)
            return Swal.fire(
                "Lỗi",
                "Không tìm thấy nội dung CV để tạo PDF. Vui lòng đảm bảo Template CV có ref={cvTemplateRef}.",
                "error"
            );

        try {
            window.scrollTo(0, 0);
            Swal.fire({
                title: "Đang tạo CV...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }

            const pdfBlob = pdf.output("blob");

            if (!userId) {
                Swal.fire(
                    "Lỗi",
                    "Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.",
                    "error"
                );
                return;
            }

            const pdfUrl = await uploadPDF(pdfBlob, `cv-${userId}_${Date.now()}.pdf`);
            await createCV(userId, cvData, pdfUrl);

            Swal.fire("Thành công", "CV đã được tạo!", "success");
        } catch (error) {
            console.error("Lỗi khi tạo CV:", error);
            Swal.fire("Lỗi", "Đã xảy ra lỗi khi tạo CV. Vui lòng thử lại.", "error");
        }
    };

    return (
        // Sidebar Content
        <div className={sidebarClasses}>

            {/* Header và Nút Đóng */}
            <div className="modal-header">
                <h5>Tùy Chỉnh CV</h5>
                <button className="close-button" onClick={onClose}>&times;</button>
            </div>

            {/* Phần 1: Đổi Template */}
            <div className="setting-group template-switcher">
                <h3 className='text-left'>1. Chọn Mẫu CV</h3>
                <div className="button-group">
                    <button
                        onClick={() => onTemplateChange('fresher')}
                        className={currentTemplate === 'fresher' ? 'active' : ''}
                        style={{ marginBottom: 5 }}
                    >
                        Fresher/Intern
                    </button>
                    <button
                        onClick={() => onTemplateChange('senior')}
                        className={currentTemplate === 'senior' ? 'active' : ''}
                        style={{ marginBottom: 5 }}
                    >
                        Senior/Kinh nghiệm
                    </button>
                </div>
            </div>

            {/* Phần 2: Tùy chỉnh Kiểu dáng */}
            <div className="setting-group customization">
                <h3 className='text-left'>2. Kiểu Dáng</h3>

                <div className="setting-item">
                    <span>Màu Chủ Đạo:</span>
                    <input
                        type="color"
                        value={customSettings.color}
                        onChange={(e) => onSettingsChange({ color: e.target.value })}
                    />
                </div>

                <div className="setting-item">
                    <span>Font Chữ:</span>
                    <select
                        value={customSettings.fontFamily}
                        onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
                    >
                        <option value="Arial">Arial (Sạch)</option>
                        <option value="Verdana">Verdana (Hiện đại)</option>
                        <option value="'Times New Roman', Times, serif">Times New Roman (Cổ điển)</option>
                        <option value="Roboto, sans-serif">Roboto (Google)</option>
                    </select>
                </div>
            </div>


            {/* Phần 3: Ngon ngu */}
            <div className="setting-group">
                <h3 className='text-left'>3. Ngôn ngữ</h3>

                <div className="setting-item">
                    <span>Ngôn ngữ:</span>
                    <select
                        value={customSettings.fontFamily}
                        onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
                    >
                        <option value="vn">Tiếng Việt 🇻🇳</option>
                        <option value="en">English 🇺🇲</option>
                    </select>
                </div>
            </div>

            {/* Phần 4:*/}
            <div className="setting-group">
                <div className="setting-item">
                    <button className='bg-emerald-600 btn-create-cv' onClick={handleCreateCV}>Tạo CV</button>
                </div>
            </div>


        </div>
    );
};

export default SettingsModal;
