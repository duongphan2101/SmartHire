import React, { forwardRef, useRef, useEffect } from 'react';
import './ModernCenteredCVTemplate.css';

export interface CvSection {
    id: string;
    title: string;
    componentKey: 'SUMMARY' | 'PROJECTS' | 'EDUCATION' | 'SKILLS' | 'ACTIVITIES' | 'EXPERIENCE';
    isRemovable: boolean;
    isVisible: boolean;
}

interface Experience {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface CustomSettings {
    color: string;
    fontFamily: string;
}

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
    experience: Experience[];
    certifications: string;
    activitiesAwards: string;
    contact: ContactInfo;
    education: Education[];
    projects: Project[];
}

interface TemplateProps { settings: CustomSettings; cvData: CVData; updateCvData: (field: keyof CVData, value: any) => void; }

// --- AUTOSIZE TEXTAREA HELPER ---
interface AutosizeTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }
const AutosizeTextArea: React.FC<AutosizeTextAreaProps> = ({ value, onChange, placeholder, ...props }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const element = textAreaRef.current;
        if (element) {
            element.style.height = '0px';
            element.style.height = `${element.scrollHeight}px`;
        }
    }, [value]);
    return <textarea ref={textAreaRef} {...props} value={value} onChange={onChange} placeholder={placeholder} />;
};


// --- MAIN COMPONENT ---
const ModernCenteredCVTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ settings, cvData, updateCvData }, ref) => {
    const safeColor = settings.color || '#059669';
    const cvStyle = { fontFamily: settings.fontFamily };

    // --- LOGIC (Đầy đủ) ---
    const updateContactField = (field: keyof ContactInfo, value: string) => updateCvData('contact', { ...cvData.contact, [field]: value });
    // Các hàm addToArray, removeFromArray, updateFieldInArray tương tự như template trên

    return (
        <div className="cv-container-modern" style={cvStyle} ref={ref}>
            <header className="cv-header-modern" style={{ borderBottomColor: safeColor }}>
                <input className="name-input" value={cvData.name} onChange={e => updateCvData('name', e.target.value)} placeholder="HỌ VÀ TÊN" />
                {/* <input className="job-title-input" value={cvData.jobTitle} onChange={e => updateCvData('jobTitle', e.target.value)} placeholder="VỊ TRÍ ỨNG TUYỂN" /> */}
                <div className="contact-info-modern">
                    <input type="text" value={cvData.contact.email} onChange={e => updateContactField('email', e.target.value)} placeholder="Email" />
                    <span>|</span>
                    <input type="text" value={cvData.contact.phone} onChange={e => updateContactField('phone', e.target.value)} placeholder="Điện thoại" />
                    <span>|</span>
                    <input type="text" value={cvData.contact.website} onChange={e => updateContactField('website', e.target.value)} placeholder="LinkedIn/Website" />
                </div>
                 <AutosizeTextArea className="summary-modern" value={cvData.introduction} onChange={e => updateCvData('introduction', e.target.value)} placeholder="Mô tả mục tiêu nghề nghiệp của bạn..." />
            </header>

            <main className="cv-body-modern">
                <section>
                    <h2 style={{ color: safeColor }}>Kinh nghiệm làm việc</h2>
                    {/* Logic render Experience của bạn ở đây */}
                </section>
                <div className="grid-2-col-modern">
                    <section>
                        <h2 style={{ color: safeColor }}>Học vấn</h2>
                        {/* Logic render Education của bạn ở đây */}
                    </section>
                     <section>
                        <h2 style={{ color: safeColor }}>Kỹ Năng</h2>
                        <AutosizeTextArea className="cv-textarea-modern" value={cvData.professionalSkills} onChange={e => updateCvData('professionalSkills', e.target.value)} placeholder="Kỹ năng chuyên môn..." />
                        <AutosizeTextArea className="cv-textarea-modern" value={cvData.softSkills} onChange={e => updateCvData('softSkills', e.target.value)} placeholder="Kỹ năng mềm..." />
                    </section>
                </div>
            </main>
        </div>
    );
});

export default ModernCenteredCVTemplate;