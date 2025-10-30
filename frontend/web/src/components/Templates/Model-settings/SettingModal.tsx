import React, { useEffect, useState } from 'react';
import './SettingModal.css';
import useCV from "../../../hook/useCV";
import Swal from 'sweetalert2';
// import * as domToImage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import useUser from '../../../hook/useUser';
import { uploadPDF } from '../../../utils/uploadPDF';
import html2canvas from 'html2canvas';

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

interface CVData {
    name: string;
    introduction: string;
    professionalSkills: string;
    softSkills: string;
    experience: Experience[];
    certifications: string;
    activitiesAwards: string;
    contact: ContactInfo;
    education: Education[];
    projects: Project[];
}

interface CustomSettings {
    color: string;
    fontFamily: string;
    lang: string;
    // cvData: CVData;
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
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen, onClose,
    currentTemplate, onTemplateChange,
    customSettings, onSettingsChange,
    cvTemplateRef, cvData
}) => {
    // const { cvData } = customSettings;
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
            return Swal.fire("Lỗi", "Không tìm thấy nội dung CV để tạo PDF. Vui lòng đảm bảo Template CV có ref={cvTemplateRef}.", "error");

        Swal.fire({
            title: "Đang tạo CV...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            window.scrollTo(0, 0);

            const canvas = await html2canvas(element, {
                scale: 2,
                logging: true,
                ignoreElements: (node) => {
                    return node.classList && (node.classList.contains('cv-editor-control') ||
                        node.classList.contains('drag-handle') ||
                        node.classList.contains('add-section-ui'));
                },
                useCORS: true,

                width: element.scrollWidth,
                height: element.scrollHeight,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
                onclone: (document) => {
                    const clonedDoc = document.documentElement;

                    // 1. Replace all INPUTS with SPANS
                    clonedDoc.querySelectorAll('input[type="text"]').forEach(input => {
                        const span = document.createElement('span');
                        const value = (input as HTMLInputElement).value || (input as HTMLInputElement).placeholder;
                        span.textContent = value;
                        span.className = input.className; // Copy classes
                        span.setAttribute('style', input.getAttribute('style') || '');

                        const computedStyle = window.getComputedStyle(input);

                        span.style.display = 'inline-block';
                        span.style.width = computedStyle.width;

                        // Copy other important styles
                        span.style.fontSize = computedStyle.fontSize;
                        span.style.fontWeight = computedStyle.fontWeight;
                        span.style.fontStyle = computedStyle.fontStyle;
                        span.style.color = computedStyle.color;
                        span.style.textAlign = computedStyle.textAlign;
                        span.style.width = computedStyle.width;

                        input.parentNode?.replaceChild(span, input);
                    });

                    clonedDoc.querySelectorAll('input[type="month"]').forEach(input => {
                        const span = document.createElement('span');
                        const value = (input as HTMLInputElement).value || (input as HTMLInputElement).placeholder;
                        span.textContent = value;
                        span.className = input.className; // Copy classes
                        span.setAttribute('style', input.getAttribute('style') || '');

                        const computedStyle = window.getComputedStyle(input);

                        span.style.display = 'inline-block';
                        span.style.width = computedStyle.width;

                        // Copy other important styles
                        span.style.fontSize = computedStyle.fontSize;
                        span.style.fontWeight = computedStyle.fontWeight;
                        span.style.fontStyle = computedStyle.fontStyle;
                        span.style.color = computedStyle.color;
                        span.style.textAlign = computedStyle.textAlign;

                        input.parentNode?.replaceChild(span, input);
                    });

                    clonedDoc.querySelectorAll('input[type="number"]').forEach(input => {
                        const span = document.createElement('span');
                        const value = (input as HTMLInputElement).value || (input as HTMLInputElement).placeholder;
                        span.textContent = value;
                        span.className = input.className; // Copy classes
                        span.setAttribute('style', input.getAttribute('style') || '');

                        const computedStyle = window.getComputedStyle(input);

                        span.style.display = 'inline-block';
                        span.style.width = computedStyle.width;

                        // Copy other important styles
                        span.style.fontSize = computedStyle.fontSize;
                        span.style.fontWeight = computedStyle.fontWeight;
                        span.style.fontStyle = computedStyle.fontStyle;
                        span.style.color = computedStyle.color;
                        span.style.textAlign = computedStyle.textAlign;

                        input.parentNode?.replaceChild(span, input);
                    });

                    // 2. Replace all TEXTAREAS with DIVS (this logic remains the same)
                    clonedDoc.querySelectorAll('textarea').forEach(textarea => {
                        const div = document.createElement('div');
                        const value = (textarea as HTMLTextAreaElement).value || (textarea as HTMLTextAreaElement).placeholder;
                        div.innerHTML = value.replace(/\n/g, '<br/>');
                        div.className = textarea.className;
                        div.setAttribute('style', textarea.getAttribute('style') || '');

                        const computedStyle = window.getComputedStyle(textarea);
                        div.style.fontSize = computedStyle.fontSize;
                        div.style.lineHeight = computedStyle.lineHeight;
                        div.style.color = computedStyle.color;

                        textarea.parentNode?.replaceChild(div, textarea);
                    });

                },
            });

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
                Swal.close();
                return Swal.fire("Lỗi", "Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.", "error");
            }

            const pdfUrl = await uploadPDF(pdfBlob, `cv-${userId}-${Date.now()}.pdf`);
            await createCV(userId, cvData, pdfUrl);

            Swal.fire("Thành công", "CV đã được tạo!", "success");

        } catch (error) {
            console.error("Lỗi khi tạo CV:", error);
            Swal.close();

            let errorMessage = "Đã xảy ra lỗi không xác định. Vui lòng xem console để biết chi tiết.";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            if (errorMessage.includes("oklch") || errorMessage.includes("parse color")) {
                errorMessage = "LỖI PARSING CSS! Hãy chuyển sang DOM-TO-IMAGE-MORE hoặc kiểm tra lại file CSS gốc.";
            }

            Swal.fire("Lỗi", `Đã xảy ra lỗi khi tạo CV. Chi tiết: ${errorMessage}`, "error");
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
                        onClick={() => onTemplateChange('twocolumns')}
                        className={currentTemplate === 'twocolumns' ? 'active' : ''}
                        style={{ marginBottom: 5 }}
                    >
                        Two Columns
                    </button>
                    <button
                        onClick={() => onTemplateChange('modern')}
                        className={currentTemplate === 'modern' ? 'active' : ''}
                        style={{ marginBottom: 5 }}
                    >
                        Modern
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
                        value={customSettings.lang}
                        onChange={(e) => onSettingsChange({ lang: e.target.value })}
                    >
                        <option value="vn">Tiếng Việt 🇻🇳</option>
                        <option value="en">English 🇺🇲</option>
                    </select>
                </div>
            </div>

            {/* Phần 4:*/}
            <div className="flex items-center justify-end">
                <button className='bg-emerald-600 btn-create-cv' onClick={handleCreateCV}>Tạo CV</button>
            </div>


        </div>
    );
};

export default SettingsModal;