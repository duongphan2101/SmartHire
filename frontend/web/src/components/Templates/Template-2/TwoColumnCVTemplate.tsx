import React, { forwardRef, useRef, useEffect, useState } from 'react';
import './TwoColumnCVTemplate.css';
import { BsFillGeoFill, BsFillTelephoneFill, BsLink45Deg, BsThreads, BsGithub } from 'react-icons/bs';

// --- Interfaces ---
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
    lang: string;
}

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
    color?: string;
    fontFamily?: string;
    languageForCV?: string;
    // Đã xóa avatar
}

interface TemplateProps {
    settings: CustomSettings;
    cvData: CVData;
    updateCvData: (field: keyof CVData, value: any) => void;
    onLayoutChange?: (order: string[]) => void;
}

// --- TỪ ĐIỂN ĐA NGÔN NGỮ ---
const translations = {
    vi: {
        CONTACT: 'THÔNG TIN',
        EDUCATION: 'HỌC VẤN',
        SKILLS: 'KỸ NĂNG',
        PROF_SKILLS: 'Chuyên môn',
        SOFT_SKILLS: 'Kỹ năng mềm',
        SUMMARY: 'MỤC TIÊU NGHỀ NGHIỆP',
        EXPERIENCE: 'KINH NGHIỆM LÀM VIỆC',
        PROJECTS: 'DỰ ÁN',
        ACTIVITIES: 'HOẠT ĐỘNG KHÁC',
        PLACEHOLDERS: {
            NAME: 'HỌ VÀ TÊN',
            JOB: 'VỊ TRÍ ỨNG TUYỂN',
            SUMMARY: 'Mô tả ngắn gọn về bản thân...',
            SCHOOL: 'Tên trường',
            MAJOR: 'Chuyên ngành',
            COMPANY: 'Tên công ty',
            JOB_TITLE: 'Chức danh',
            PROJECT: 'Tên dự án',
            DESC: '- Mô tả chi tiết...',
            SKILL_PROF: 'Nhập kỹ năng chuyên môn...',
            SKILL_SOFT: 'Nhập kỹ năng mềm...',
            ACTIVITIES: 'Giải thưởng, chứng chỉ...'
        },
        ADD: '+ Thêm',
        SHOW: 'Hiện',
        HIDE: 'Ẩn',
    },
    en: {
        CONTACT: 'CONTACT',
        EDUCATION: 'EDUCATION',
        SKILLS: 'SKILLS',
        PROF_SKILLS: 'Professional',
        SOFT_SKILLS: 'Soft Skills',
        SUMMARY: 'SUMMARY',
        EXPERIENCE: 'WORK EXPERIENCE',
        PROJECTS: 'PROJECTS',
        ACTIVITIES: 'ACTIVITIES',
        PLACEHOLDERS: {
            NAME: 'FULL NAME',
            JOB: 'APPLIED POSITION',
            SUMMARY: 'Brief summary about yourself...',
            SCHOOL: 'University Name',
            MAJOR: 'Major',
            COMPANY: 'Company Name',
            JOB_TITLE: 'Job Title',
            PROJECT: 'Project Name',
            DESC: '- Detailed description...',
            SKILL_PROF: 'Enter professional skill...',
            SKILL_SOFT: 'Enter soft skill...',
            ACTIVITIES: 'Awards, certificates...'
        },
        ADD: '+ Add',
        SHOW: 'Show',
        HIDE: 'Hide',
    }
};

const professionalSkillOptions = [
    "ReactJS", "React Native", "Vue.js", "Angular", "Node.js", "Express", "NestJS", "Spring Boot", 
    "Java", "Python", "C#", ".NET", "MongoDB", "MySQL", "PostgreSQL", "AWS", "Docker", "CI/CD", 
    "Git", "TypeScript", "JavaScript", "HTML5", "CSS3"
];

const softSkillOptions = [
    "Teamwork", "Communication", "Problem Solving", "Critical Thinking", "Leadership", 
    "Time Management", "Adaptability", "Creativity", "English", "Presentation"
];

// --- AUTOSIZE TEXTAREA HELPER ---
interface AutosizeTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }
const AutosizeTextArea: React.FC<AutosizeTextAreaProps> = ({ value, onChange, placeholder, className, style, ...props }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const element = textAreaRef.current;
        if (element) {
            element.style.height = '0px';
            element.style.height = `${element.scrollHeight}px`;
        }
    }, [value]);
    return <textarea ref={textAreaRef} className={`cv-input-multiline ${className || ''}`} style={style} value={value} onChange={onChange} placeholder={placeholder} rows={1} {...props} />;
};

// --- MAIN COMPONENT ---
const TwoColumnCVTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ settings, cvData, updateCvData, onLayoutChange }, ref) => {
    const safeColor = settings.color || cvData.color || '#059669';
    const rawFont = settings.fontFamily || cvData.fontFamily || 'Arial';
    
    // Ngôn ngữ
    const rawLang = settings.lang || cvData.languageForCV || 'vi';
    const lang = rawLang === 'en' ? 'en' : 'vi';
    const T = translations[lang];

    // Style variables
    const cvStyle = { fontFamily: rawFont };
    const sidebarStyle = { backgroundColor: `${safeColor}10` };
    const accentStyle = { color: safeColor };
    const borderStyle = { borderColor: safeColor };

    // --- State cho Ẩn/Hiện Sections ---
    const [showContact, setShowContact] = useState(true);
    const [showEducation, setShowEducation] = useState(true);
    const [showSkills, setShowSkills] = useState(true);
    // Main sections (có thể thêm toggle cho main section nếu cần)
    const [showSummary, setShowSummary] = useState(true);
    const [showExperience, setShowExperience] = useState(true);
    const [showProjects, setShowProjects] = useState(true);
    const [showActivities, setShowActivities] = useState(true);

    // --- Helper Functions ---
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

    // --- Skill Logic ---
    const [profInput, setProfInput] = useState("");
    const [softInput, setSoftInput] = useState("");
    const [showProfSugg, setShowProfSugg] = useState(false);
    const [showSoftSugg, setShowSoftSugg] = useState(false);
    const [filteredProfSkills, setFilteredProfSkills] = useState<string[]>([]);
    const [filteredSoftSkills, setFilteredSoftSkills] = useState<string[]>([]);

    const skillsArray = (str: string) => {
        try { return str ? JSON.parse(str) : []; } 
        catch { return str.split(',').map(s=>s.trim()).filter(s=>s); }
    };
    
    const profSkills = skillsArray(cvData.professionalSkills);
    const softSkills = skillsArray(cvData.softSkills);

    const updateSkills = (newSkills: string[], type: 'professionalSkills'|'softSkills') => {
        updateCvData(type, JSON.stringify(newSkills));
    };

    const addSkill = (skill: string, type: 'professionalSkills'|'softSkills', inputSetter: any, suggSetter: any) => {
        const current = type === 'professionalSkills' ? profSkills : softSkills;
        if (!current.includes(skill)) updateSkills([...current, skill], type);
        inputSetter("");
        suggSetter(false);
    };

    const removeSkill = (skill: string, type: 'professionalSkills'|'softSkills') => {
        const current = type === 'professionalSkills' ? profSkills : softSkills;
        updateSkills(current.filter((s: string) => s !== skill), type);
    };

    const handleProfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProfInput(value);
        setFilteredProfSkills(professionalSkillOptions.filter((opt) => opt.toLowerCase().includes(value.toLowerCase())));
        setShowProfSugg(true);
    };

    const handleSoftInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSoftInput(value);
        setFilteredSoftSkills(softSkillOptions.filter((opt) => opt.toLowerCase().includes(value.toLowerCase())));
        setShowSoftSugg(true);
    };

    // Sync Layout
    useEffect(() => {
        if (onLayoutChange) {
            const activeSections = [
                showSummary && 'SUMMARY',
                showExperience && 'EXPERIENCE',
                showProjects && 'PROJECTS',
                showEducation && 'EDUCATION',
                showSkills && 'SKILLS',
                showActivities && 'ACTIVITIES'
            ].filter(Boolean) as string[];
            
            onLayoutChange(activeSections);
        }
    }, [showSummary, showExperience, showProjects, showEducation, showSkills, showActivities, onLayoutChange]);

    return (
        <div className="cv-container-twocolumn" style={cvStyle} ref={ref}>
            
            {/* --- SIDEBAR --- */}
            <aside className="cv-sidebar" style={sidebarStyle}>
                
                {/* CONTACT */}
                <section className="sidebar-section group">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="sidebar-title" style={{ ...accentStyle, ...borderStyle, ...cvStyle }}>{T.CONTACT}</h3>
                        <button className="toggle-btn" onClick={() => setShowContact(!showContact)}>{showContact ? T.HIDE : T.SHOW}</button>
                    </div>
                    
                    {showContact && (
                        <div className="contact-list">
                            <div className="contact-row" style={{ ...cvStyle }}>
                                <BsThreads color={safeColor} />
                                <input className="cv-input" value={cvData.contact.email} onChange={e => updateContactField('email', e.target.value)} placeholder="Email" />
                            </div>
                            <div className="contact-row" style={{ ...cvStyle }}>
                                <BsFillTelephoneFill color={safeColor} />
                                <input className="cv-input" value={cvData.contact.phone} onChange={e => updateContactField('phone', e.target.value)} placeholder="Phone" />
                            </div>
                            <div className="contact-row" style={{ ...cvStyle }}>
                                <BsFillGeoFill color={safeColor} />
                                <input className="cv-input" value={cvData.contact.address} onChange={e => updateContactField('address', e.target.value)} placeholder="Address" />
                            </div>
                            <div className="contact-row" style={{ ...cvStyle }}>
                                <BsLink45Deg color={safeColor} size={18} />
                                <input className="cv-input" value={cvData.contact.website} onChange={e => updateContactField('website', e.target.value)} placeholder="Website/LinkedIn" />
                            </div>
                            <div className="contact-row" style={{ ...cvStyle }}>
                                <BsGithub color={safeColor} />
                                <input className="cv-input" value={cvData.contact.github} onChange={e => updateContactField('github', e.target.value)} placeholder="Github" />
                            </div>
                        </div>
                    )}
                </section>

                {/* EDUCATION */}
                <section className="sidebar-section group">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="sidebar-title" style={{ ...accentStyle, ...borderStyle, ...cvStyle }}>{T.EDUCATION}</h3>
                        <button className="toggle-btn" onClick={() => setShowEducation(!showEducation)}>{showEducation ? T.HIDE : T.SHOW}</button>
                    </div>
                    
                    {showEducation && (
                        <>
                            {(cvData.education || []).map((edu, index) => (
                                <div key={index} className="sidebar-item group/item" style={{ ...cvStyle }}>
                                    <input className="cv-input-bold" style={{ ...cvStyle }} value={edu.university} onChange={e => updateFieldInArray('education', index, 'university', e.target.value)} placeholder={T.PLACEHOLDERS.SCHOOL} />
                                    <input className="cv-input" style={{ ...cvStyle }} value={edu.major} onChange={e => updateFieldInArray('education', index, 'major', e.target.value)} placeholder={T.PLACEHOLDERS.MAJOR} />
                                    <div className="date-range" style={{ ...cvStyle }}>
                                        <input value={edu.startYear} onChange={e => updateFieldInArray('education', index, 'startYear', e.target.value)} placeholder="2020" />
                                        <span>-</span>
                                        <input value={edu.endYear} onChange={e => updateFieldInArray('education', index, 'endYear', e.target.value)} placeholder="2024" />
                                    </div>
                                    {edu.gpa && <div className='text-xs text-gray-500 mt-1'>GPA: {edu.gpa}</div>}
                                    <button className="delete-btn" onClick={() => removeFromArray('education', index)}>🗑</button>
                                </div>
                            ))}
                            <button className="add-btn" style={{ borderColor: safeColor, color: safeColor }} onClick={() => addToArray('education', { university: '', major: '', gpa: '', startYear: '', endYear: '' })}>{T.ADD}</button>
                        </>
                    )}
                </section>

                {/* SKILLS */}
                <section className="sidebar-section group">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="sidebar-title" style={{ ...accentStyle, ...borderStyle, ...cvStyle }}>{T.SKILLS}</h3>
                        <button className="toggle-btn" onClick={() => setShowSkills(!showSkills)}>{showSkills ? T.HIDE : T.SHOW}</button>
                    </div>

                    {showSkills && (
                        <>
                            {/* Professional */}
                            <div className="skill-block mb-4" style={{ ...cvStyle }}>
                                <strong style={{ ...accentStyle, ...cvStyle }}>{T.PROF_SKILLS}</strong>
                                <div className="skill-tags">
                                    {profSkills.map((skill: string) => (
                                        <span key={skill} className="skill-tag" style={{ borderBottomColor: safeColor }}>
                                            {skill} <span className="remove-tag" onClick={() => removeSkill(skill, 'professionalSkills')}>×</span>
                                        </span>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input 
                                        className="cv-input mt-1" 
                                        value={profInput} 
                                        onChange={handleProfInputChange}
                                        onFocus={() => setShowProfSugg(true)}
                                        onBlur={() => setTimeout(() => setShowProfSugg(false), 200)}
                                        onKeyDown={e => { if(e.key==='Enter' && profInput) addSkill(profInput, 'professionalSkills', setProfInput, setShowProfSugg); }}
                                        placeholder={T.PLACEHOLDERS.SKILL_PROF}
                                    />
                                    {showProfSugg && profInput && (
                                        <div className="suggestion-box">
                                            {filteredProfSkills.map(s => (
                                                <div key={s} className="suggestion-item" onClick={() => addSkill(s, 'professionalSkills', setProfInput, setShowProfSugg)}>{s}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Soft Skills */}
                            <div className="skill-block" style={{ ...cvStyle }}>
                                <strong style={{ ...accentStyle, ...cvStyle }}>{T.SOFT_SKILLS}</strong>
                                <div className="skill-tags">
                                    {softSkills.map((skill: string) => (
                                        <span key={skill} className="skill-tag" style={{ borderBottomColor: safeColor }}>
                                            {skill} <span className="remove-tag" onClick={() => removeSkill(skill, 'softSkills')}>×</span>
                                        </span>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input 
                                        className="cv-input mt-1" 
                                        value={softInput} 
                                        onChange={handleSoftInputChange}
                                        onFocus={() => setShowSoftSugg(true)}
                                        onBlur={() => setTimeout(() => setShowSoftSugg(false), 200)}
                                        onKeyDown={e => { if(e.key==='Enter' && softInput) addSkill(softInput, 'softSkills', setSoftInput, setShowSoftSugg); }}
                                        placeholder={T.PLACEHOLDERS.SKILL_SOFT}
                                    />
                                    {showSoftSugg && softInput && (
                                        <div className="suggestion-box">
                                            {filteredSoftSkills.map(s => (
                                                <div key={s} className="suggestion-item" onClick={() => addSkill(s, 'softSkills', setSoftInput, setShowSoftSugg)}>{s}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="cv-main">
                
                {/* HEADER */}
                <header className="main-section mb-6">
                    <input className="cv-input-name-lg uppercase" style={{ ...accentStyle, ...cvStyle }} value={cvData.name} onChange={e => updateCvData('name', e.target.value)} placeholder={T.PLACEHOLDERS.NAME} />
                    <input className="cv-input-job-lg" style={{ ...cvStyle }} value={cvData.title} onChange={e => updateCvData('title', e.target.value)} placeholder={T.PLACEHOLDERS.JOB} />
                    <div className="header-underline" style={{ backgroundColor: safeColor }}></div>
                </header>

                {/* SUMMARY */}
                <section className="main-section group relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="main-title" style={{ ...accentStyle, ...borderStyle, ...cvStyle }}>{T.SUMMARY}</h3>
                        <button className="toggle-btn absolute right-0 top-0" onClick={() => setShowSummary(!showSummary)}>{showSummary ? T.HIDE : T.SHOW}</button>
                    </div>
                    {showSummary && (
                        <AutosizeTextArea 
                            className="summary-text"
                            value={cvData.introduction} 
                            onChange={e => updateCvData('introduction', e.target.value)} 
                            placeholder={T.PLACEHOLDERS.SUMMARY} 
                            style={{ ...cvStyle }}
                        />
                    )}
                </section>

                {/* EXPERIENCE */}
                <section className="main-section group relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="main-title" style={{ ...accentStyle, ...borderStyle, ...cvStyle }}>{T.EXPERIENCE}</h3>
                        <button className="toggle-btn absolute right-0 top-0" onClick={() => setShowExperience(!showExperience)}>{showExperience ? T.HIDE : T.SHOW}</button>
                    </div>
                    {showExperience && (
                        <>
                            {(cvData.experience || []).map((exp, index) => (
                                <div key={index} className="main-item group/item relative">
                                    <div className="main-item-header">
                                        <input className="item-title" style={{ ...cvStyle, color: 'black' }} value={exp.jobTitle} onChange={e => updateFieldInArray('experience', index, 'jobTitle', e.target.value)} placeholder={T.PLACEHOLDERS.JOB_TITLE} />
                                        <div className="item-date">
                                            <input value={exp.startDate} style={{ ...cvStyle }} onChange={e => updateFieldInArray('experience', index, 'startDate', e.target.value)} placeholder="MM/YYYY" />
                                            <span> - </span>
                                            <input value={exp.endDate} style={{ ...cvStyle }} onChange={e => updateFieldInArray('experience', index, 'endDate', e.target.value)} placeholder="MM/YYYY" />
                                        </div>
                                    </div>
                                    <input className="item-subtitle" style={{ ...cvStyle }} value={exp.company} onChange={e => updateFieldInArray('experience', index, 'company', e.target.value)} placeholder={T.PLACEHOLDERS.COMPANY} />
                                    <AutosizeTextArea 
                                        className="item-desc"
                                        value={exp.description} 
                                        style={{ ...cvStyle }}
                                        onChange={e => updateFieldInArray('experience', index, 'description', e.target.value)} 
                                        placeholder={T.PLACEHOLDERS.DESC}
                                    />
                                    <button className="delete-btn-absolute" onClick={() => removeFromArray('experience', index)}>🗑</button>
                                </div>
                            ))}
                            <button className="add-btn-main" style={{ ...cvStyle }} onClick={() => addToArray('experience', { jobTitle: '', company: '', startDate: '', endDate: '', description: '' })}>{T.ADD}</button>
                        </>
                    )}
                </section>

                {/* PROJECTS */}
                <section className="main-section group relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="main-title" style={{ ...accentStyle, ...borderStyle, ...cvStyle }}>{T.PROJECTS}</h3>
                        <button className="toggle-btn absolute right-0 top-0" onClick={() => setShowProjects(!showProjects)}>{showProjects ? T.HIDE : T.SHOW}</button>
                    </div>
                    {showProjects && (
                        <>
                            {(cvData.projects || []).map((proj, index) => (
                                <div key={index} className="main-item group/item relative">
                                    <div className="main-item-header">
                                        <input className="item-title" style={{ ...cvStyle, color: 'black' }} value={proj.projectName} onChange={e => updateFieldInArray('projects', index, 'projectName', e.target.value)} placeholder={T.PLACEHOLDERS.PROJECT} />
                                    </div>
                                    <AutosizeTextArea 
                                        className="item-desc"
                                        value={proj.projectDescription} 
                                        style={{ ...cvStyle }}
                                        onChange={e => updateFieldInArray('projects', index, 'projectDescription', e.target.value)} 
                                        placeholder={T.PLACEHOLDERS.DESC}
                                    />
                                    <button className="delete-btn-absolute" onClick={() => removeFromArray('projects', index)}>🗑</button>
                                </div>
                            ))}
                            <button className="add-btn-main" style={{ ...cvStyle }} onClick={() => addToArray('projects', { projectName: '', projectDescription: '' })}>{T.ADD}</button>
                        </>
                    )}
                </section>

                {/* ACTIVITIES */}
                <section className="main-section group relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="main-title" style={{ ...accentStyle, ...borderStyle, ...cvStyle }}>{T.ACTIVITIES}</h3>
                        <button className="toggle-btn absolute right-0 top-0" onClick={() => setShowActivities(!showActivities)}>{showActivities ? T.HIDE : T.SHOW}</button>
                    </div>
                    {showActivities && (
                        <AutosizeTextArea 
                            className="item-desc"
                            value={cvData.activitiesAwards} 
                            style={{ ...cvStyle }}
                            onChange={e => updateCvData('activitiesAwards', e.target.value)} 
                            placeholder={T.PLACEHOLDERS.ACTIVITIES}
                        />
                    )}
                </section>

            </main>
        </div>
    );
});

export default TwoColumnCVTemplate;