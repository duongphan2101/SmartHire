import React, { useEffect, useState } from 'react';
import './SettingModal.css';
import useCV from "../../../hook/useCV";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import useUser from '../../../hook/useUser';
import { uploadPDF } from '../../../utils/uploadPDF';
import html2canvas from 'html2canvas';

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
    isEditMode?: boolean;
    cvId?: string | null;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen, onClose,
    currentTemplate, onTemplateChange,
    customSettings, onSettingsChange,
    cvTemplateRef, cvData,
    isEditMode = false,
    cvId = null
}) => {
    const sidebarClasses = `settings-sidebar ${isOpen ? 'is-open' : 'is-open'}`;
    const { createCV, updateCV } = useCV();

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

    const handleSaveCV = async () => {
        const element = cvTemplateRef.current;
        if (!element) return Swal.fire("Lỗi", "Không tìm thấy nội dung CV.", "error");

        Swal.fire({
            title: isEditMode ? "Đang lưu thay đổi..." : "Đang tạo CV...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            window.scrollTo(0, 0);

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                scrollY: -window.scrollY,
                ignoreElements: (node) => {
                    return node.classList && (
                        node.classList.contains('cv-editor-control') ||
                        node.classList.contains('drag-handle') ||
                        node.classList.contains('add-section-ui')
                    );
                },

                // --- THUẬT TOÁN DÀN TRANG NÂNG CẤP ---
                onclone: (clonedDoc) => {
                    const cvContainer = clonedDoc.querySelector('.cv-container') as HTMLElement;

                    if (cvContainer) {
                        // 1. Setup cơ bản
                        cvContainer.style.padding = '30px 40px';
                        cvContainer.style.boxSizing = 'border-box';
                        cvContainer.style.backgroundColor = '#ffffff';

                        // 2. Tính toán chiều cao trang A4 theo Pixel
                        const contentWidth = cvContainer.clientWidth;
                        const pageHeight = (contentWidth * 297) / 210; // A4 ratio

                        // Hàm helper: Lấy vị trí Y thực tế của element so với đỉnh CV
                        const getAbsoluteTop = (el: HTMLElement) => {
                            let top = 0;
                            let current = el;
                            while (current && current !== cvContainer) {
                                top += current.offsetTop || 0;
                                current = current.offsetParent as HTMLElement;
                            }
                            return top;
                        };

                        // Hàm helper: Xử lý đẩy element xuống trang sau
                        const pushToNextPage = (el: HTMLElement, currentTop: number) => {
                            const startPage = Math.floor(currentTop / pageHeight);
                            const nextPageStart = (startPage + 1) * pageHeight;
                            const spaceNeeded = nextPageStart - currentTop;

                            // Thêm margin-top, cộng thêm 30px đệm cho đẹp
                            const currentMargin = parseInt(window.getComputedStyle(el).marginTop || '0');
                            el.style.marginTop = `${currentMargin + spaceNeeded + 30}px`;
                        };

                        // 3. DUYỆT CÁC SECTION LỚN
                        const sections = cvContainer.querySelectorAll('.cv-section-draggable-wrapper');

                        sections.forEach((section) => {
                            const secEl = section as HTMLElement;
                            const secTop = getAbsoluteTop(secEl);
                            const secHeight = secEl.offsetHeight;
                            const secBottom = secTop + secHeight;

                            const startPage = Math.floor(secTop / pageHeight);
                            const endPage = Math.floor(secBottom / pageHeight);

                            // Nếu Section nằm gọn trong 1 trang -> OK, bỏ qua
                            if (startPage === endPage) return;

                            // NẾU BỊ CẮT NGANG: Kiểm tra xem có đẩy cả Section được không
                            // (Nếu section nhỏ < 1/2 trang thì đẩy cả section, ngược lại thì xử lý con)
                            if (secHeight < pageHeight * 0.5) {
                                pushToNextPage(secEl, secTop);
                            } else {
                                // 4. XỬ LÝ CẤP 2: DUYỆT CÁC MỤC CON (Job, Project, Education Entry)
                                const children = secEl.querySelectorAll('.job-entry, .education-entry, .project-entry');

                                if (children.length > 0) {
                                    children.forEach((child) => {
                                        const childEl = child as HTMLElement;
                                        // Phải tính lại Top vì margin của các phần tử trước có thể đã thay đổi
                                        const childTop = getAbsoluteTop(childEl);
                                        const childHeight = childEl.offsetHeight;
                                        const childBottom = childTop + childHeight;

                                        const cStartPage = Math.floor(childTop / pageHeight);
                                        const cEndPage = Math.floor(childBottom / pageHeight);

                                        // Nếu mục con này bị cắt ngang -> Đẩy nó xuống
                                        if (cStartPage !== cEndPage) {
                                            pushToNextPage(childEl, childTop);
                                        }
                                    });
                                }
                            }
                        });
                    }

                    // --- CÁC PHẦN XỬ LÝ INPUT/TEXTAREA GIỮ NGUYÊN ---
                    const processInput = (input: HTMLInputElement) => {
                        const span = clonedDoc.createElement('span');
                        const value = input.value || input.placeholder || '';
                        span.textContent = value;
                        span.className = input.className;
                        const style = window.getComputedStyle(input);
                        span.style.cssText = `display: inline-block; width: ${style.width}; font-size: ${style.fontSize}; font-family: ${style.fontFamily}; font-weight: ${style.fontWeight}; color: ${style.color}; text-align: ${style.textAlign}; padding: 0; margin: 0; border: none; background: transparent;`;
                        input.parentNode?.replaceChild(span, input);
                    };
                    clonedDoc.querySelectorAll('input').forEach((input) => processInput(input as HTMLInputElement));

                    clonedDoc.querySelectorAll('textarea').forEach((textarea) => {
                        const div = clonedDoc.createElement('div');
                        const value = textarea.value || textarea.placeholder || '';
                        div.innerHTML = value.replace(/\n/g, '<br/>');
                        div.className = textarea.className;
                        const style = window.getComputedStyle(textarea);
                        div.style.cssText = `width: ${style.width}; font-size: ${style.fontSize}; font-family: ${style.fontFamily}; line-height: ${style.lineHeight}; color: ${style.color}; text-align: ${style.textAlign || 'justify'}; white-space: pre-wrap; border: none;`;
                        textarea.parentNode?.replaceChild(div, textarea);
                    });
                },
            });

            // --- PHẦN TẠO PDF (GIỮ NGUYÊN) ---
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;
            const pdfPageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfPageHeight;

            while (heightLeft > 1) {
                position = position - pdfPageHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfPageHeight;
            }

            const pdfBlob = pdf.output("blob");

            // ... (Logic Upload & Save) ...
            if (!userId) {
                Swal.close();
                return Swal.fire("Lỗi", "Không tìm thấy ID người dùng.", "error");
            }
            const pdfUrl = await uploadPDF(pdfBlob, `cv-${userId}-${Date.now()}.pdf`);
            if (isEditMode && cvId) {
                if (updateCV) {
                    await updateCV(cvId, cvData, pdfUrl);
                    Swal.fire("Thành công", "CV đã được cập nhật!", "success");
                }
            } else {
                await createCV(userId, cvData, pdfUrl);
                Swal.fire("Thành công", "CV đã được tạo!", "success");
            }

        } catch (error) {
            console.error(error);
            Swal.close();
            Swal.fire("Lỗi", "Có lỗi xảy ra", "error");
        }
    };

    return (
        // Sidebar Content
        <div className={sidebarClasses}>

            {/* Header và Nút Đóng */}
            <div className="modal-header">
                <h5>{isEditMode ? "Chỉnh Sửa CV" : "Tạo Mới CV"}</h5>
                <button className="close-button" onClick={onClose}>&times;</button>
            </div>

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
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="'Times New Roman', Times, serif">Times New Roman</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                    </select>
                </div>
            </div>

            <div className="setting-group">
                <h3 className='text-left'>3. Ngôn ngữ</h3>

                <div className="setting-item">
                    <span>Ngôn ngữ:</span>
                    <select
                        value={customSettings.lang}
                        onChange={(e) => onSettingsChange({ lang: e.target.value })}
                    >
                        <option value="vn">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            {/* Phần 4: Action Button */}
            <div className="flex items-center justify-end">
                <button
                    className={`btn-create-cv ${isEditMode ? 'bg-emerald-600' : 'bg-emerald-600'}`}
                    onClick={handleSaveCV}
                >
                    {isEditMode ? "Lưu thay đổi" : "Tạo CV"}
                </button>
            </div>


        </div>
    );
};

export default SettingsModal;