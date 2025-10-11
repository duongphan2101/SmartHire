import React, { forwardRef, useRef, useEffect } from 'react';
import './TwoColumnCVTemplate.css';

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
    return <textarea ref={textAreaRef} className="cv-textarea-twocolumn" value={value} onChange={onChange} placeholder={placeholder} {...props} />;
};


// --- MAIN COMPONENT ---
const TwoColumnCVTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ settings, cvData, updateCvData }, ref) => {
    const safeColor = settings.color || '#059669';
    const cvStyle = { fontFamily: settings.fontFamily };

    // --- LOGIC (Đầy đủ) ---
    const updateContactField = (field: keyof ContactInfo, value: string) => updateCvData('contact', { ...cvData.contact, [field]: value });
    const addToArray = <T,>(arrayName: keyof CVData, newItem: T) => updateCvData(arrayName, [...(cvData[arrayName] as T[] || []), newItem]);
    const removeFromArray = (arrayName: keyof CVData, index: number) => updateCvData(arrayName, (cvData[arrayName] as any[] || []).filter((_, i) => i !== index));
    const updateFieldInArray = <T,>(arrayName: keyof CVData, index: number, field: keyof T, value: string) => {
        const array = (cvData[arrayName] as T[] || []).slice();
        if(array[index]) {
            array[index] = { ...array[index], [field]: value };
            updateCvData(arrayName, array);
        }
    };
    
    return (
        <div className="cv-container-twocolumn" style={cvStyle} ref={ref}>
            <aside className="cv-sidebar-twocolumn" style={{ backgroundColor: `${safeColor}1A` }}>
                <section>
                    <h2 style={{ color: safeColor }}>Liên Hệ</h2>
                    <div className="contact-item"><strong>Email</strong><input type="text" value={cvData.contact.email} onChange={e => updateContactField('email', e.target.value)} /></div>
                    <div className="contact-item"><strong>Điện thoại</strong><input type="text" value={cvData.contact.phone} onChange={e => updateContactField('phone', e.target.value)} /></div>
                    <div className="contact-item"><strong>LinkedIn</strong><input type="text" value={cvData.contact.website} onChange={e => updateContactField('website', e.target.value)} /></div>
                    <div className="contact-item"><strong>GitHub</strong><input type="text" value={cvData.contact.github} onChange={e => updateContactField('github', e.target.value)} /></div>
                </section>
                <section>
                    <h2 style={{ color: safeColor }}>Học Vấn</h2>
                    {(cvData.education || []).map((edu, index) => (
                        <div key={index} className="sidebar-entry">
                             <input className="sidebar-entry-title" value={edu.university} onChange={e => updateFieldInArray('education', index, 'university', e.target.value)} placeholder="Tên trường"/>
                             <input className="sidebar-entry-subtitle" value={edu.major} onChange={e => updateFieldInArray('education', index, 'major', e.target.value)} placeholder="Chuyên ngành"/>
                             <button onClick={() => removeFromArray('education', index)}>Xóa</button>
                        </div>
                    ))}
                    <button onClick={() => addToArray('education', { university: '', major: '', gpa: '', startYear: '', endYear: '' })}>+ Thêm học vấn</button>
                </section>
                <section>
                    <h2 style={{ color: safeColor }}>Kỹ Năng</h2>
                    <strong>Chuyên môn</strong>
                    <AutosizeTextArea value={cvData.professionalSkills} onChange={e => updateCvData('professionalSkills', e.target.value)} placeholder="React, Node.js,..." />
                    <strong>Kỹ năng mềm</strong>
                    <AutosizeTextArea value={cvData.softSkills} onChange={e => updateCvData('softSkills', e.target.value)} placeholder="Giao tiếp, Teamwork,..." />
                </section>
            </aside>

            <main className="cv-main-twocolumn">
                <header className="cv-header-twocolumn">
                    <input className="name-input" style={{ color: safeColor }} value={cvData.name} onChange={e => updateCvData('name', e.target.value)} placeholder="HỌ VÀ TÊN" />
                    {/* <input className="job-title-input" value={cvData.jobTitle} onChange={e => updateCvData('jobTitle', e.target.value)} placeholder="VỊ TRÍ ỨNG TUYỂN" /> */}
                </header>
                <section>
                    <h2 style={{ color: safeColor }}>Mục tiêu nghề nghiệp</h2>
                    <AutosizeTextArea value={cvData.introduction} onChange={e => updateCvData('introduction', e.target.value)} placeholder="Mô tả ngắn gọn..." />
                </section>
                <section>
                    <h2 style={{ color: safeColor }}>Kinh nghiệm làm việc</h2>
                    {(cvData.experience || []).map((exp, index) => (
                         <div key={index} className="main-entry">
                            <div className="entry-header">
                                <input className="entry-title" value={exp.jobTitle} onChange={e => updateFieldInArray('experience', index, 'jobTitle', e.target.value)} placeholder="Chức danh"/>
                                <input className="entry-subtitle" value={exp.company} onChange={e => updateFieldInArray('experience', index, 'company', e.target.value)} placeholder="Công ty"/>
                            </div>
                             <AutosizeTextArea value={exp.description} onChange={e => updateFieldInArray('experience', index, 'description', e.target.value)} placeholder="Mô tả công việc..."/>
                             <button onClick={() => removeFromArray('experience', index)}>Xóa</button>
                        </div>
                    ))}
                     <button onClick={() => addToArray('experience', { jobTitle: '', company: '', startDate: '', endDate: '', description: '' })}>+ Thêm kinh nghiệm</button>
                </section>
                {/* Các section khác như Projects, Activities tương tự */}
            </main>
        </div>
    );
});

export default TwoColumnCVTemplate;