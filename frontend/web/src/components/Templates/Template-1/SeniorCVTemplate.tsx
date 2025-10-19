import React, { useState, forwardRef, useRef, useEffect } from 'react';
import './SeniorCVTemplate.css';
import Modal_AI_Recomend from '../../Modal-AI-Recomend/Modal-AI-Recomend';
import { MdAlternateEmail } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa6';

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

interface FreshInternCVTemplateProps {
    settings: CustomSettings;
    cvData: CVData;
    updateCvData: (field: keyof CVData, value: any) => void;
}

// --- TỪ ĐIỂN ĐA NGÔN NGỮ ---
const translations = {
    vi: {
        SECTIONS: {
            SUMMARY: 'Mục tiêu Nghề nghiệp',
            EXPERIENCE: 'Kinh nghiệm Làm việc',
            PROJECTS: 'Dự án',
            EDUCATION: 'Học vấn',
            SKILLS: 'Kỹ năng Chuyên môn',
            ACTIVITIES: 'Kinh nghiệm Khác (Hoạt động & Thành tích)',
        },
        PHRASES: {
            ADD_SECTION: 'Thêm các mục đã ẩn:',
            ADD: '+ Thêm',
            REMOVE: 'Xóa',
            HIDE: 'Ẩn',
            AI_SUGGESTION: '✨ Gợi ý AI',
            NAME: 'HỌ VÀ TÊN',
            JOB_TITLE: 'VỊ TRÍ ỨNG TUYỂN (Fresher / Intern / Apprentice)',
            EMAIL: 'Email:',
            PHONE: 'Số điện thoại:',
            LINKEDIN: 'LinkedIn:',
            GITHUB_PORTFOLIO: 'GitHub/Portfolio:',
            PHONE_PLACEHOLDER: '(84) [Số điện thoại]',
            LINKEDIN_PLACEHOLDER: 'linkedin.com/in/...',
            GITHUB_PLACEHOLDER: 'github.com/...',
            SUMMARY_PLACEHOLDER: 'Sinh viên năm cuối/Mới tốt nghiệp chuyên ngành... tìm kiếm cơ hội Intern/Fresher.',
            JOB_TITLE_PLACEHOLDER: 'Vị trí/Chức danh',
            COMPANY_PLACEHOLDER: 'Tên Công ty/Tổ chức',
            AT: 'tại',
            TIME_PLACEHOLDER: 'Thời gian: MM/YYYY - Hiện tại/MM/YYYY',
            EXP_DESC_PLACEHOLDER: '* Mô tả nhiệm vụ chính, tập trung vào kết quả đạt được.\n* Sử dụng con số (nếu có): Tối ưu hóa [X] quy trình/giảm [Y]% lỗi.',
            PROJECT_NAME_PLACEHOLDER: 'Tên Đồ Án / Dự án cá nhân',
            PROJ_DESC_PLACEHOLDER: '* Xây dựng một ứng dụng [Loại ứng dụng] bằng [Công nghệ chính A].\n* Định lượng kết quả: Dự án xử lý [X] bản ghi/giảm [Y]% thời gian xử lý.',
            UNIVERSITY: 'Trường Đại Học:',
            UNIVERSITY_PLACEHOLDER: 'Tên Trường Đại Học',
            MAJOR: 'Chuyên ngành:',
            MAJOR_PLACEHOLDER: 'Tên chuyên ngành',
            TIME: 'Thời gian:',
            START_YEAR_PLACEHOLDER: 'Năm bắt đầu',
            END_YEAR_PLACEHOLDER: 'Năm tốt nghiệp',
            PROFESSIONAL_SKILLS: 'Chuyên môn:',
            SOFT_SKILLS: 'Kỹ năng mềm:',
            OTHER_EXP_PLACEHOLDER: '* Thực tập ngắn hạn/Freelance: [Tên công ty/dự án].\n* Giải thưởng: [Tên giải thưởng] trong cuộc thi lập trình [Tên cuộc thi].\n* Chứng chỉ: Chứng chỉ [Tên chứng chỉ].',
            NEW_PROJECT: 'Dự án mới',
            NEW_EDUCATION: 'Trường Đại Học Mới',
            NEW_EXPERIENCE: 'Vị trí mới',
            COMPANY: 'Tên Công ty',
        }
    },
    en: {
        SECTIONS: {
            SUMMARY: 'Summary',
            EXPERIENCE: 'Work Experience',
            PROJECTS: 'Projects',
            EDUCATION: 'Education',
            SKILLS: 'Professional Skills',
            ACTIVITIES: 'Other Experience (Activities & Awards)',
        },
        PHRASES: {
            ADD_SECTION: 'Add hidden sections:',
            ADD: '+ Add',
            REMOVE: 'Remove',
            HIDE: 'Hide',
            AI_SUGGESTION: '✨ AI Suggestion',
            NAME: 'FULL NAME',
            JOB_TITLE: 'APPLIED POSITION (Fresher / Intern / Apprentice)',
            EMAIL: 'Email:',
            PHONE: 'Phone:',
            LINKEDIN: 'LinkedIn:',
            GITHUB_PORTFOLIO: 'GitHub/Portfolio:',
            PHONE_PLACEHOLDER: '(+1) [Phone Number]',
            LINKEDIN_PLACEHOLDER: 'linkedin.com/in/...',
            GITHUB_PLACEHOLDER: 'github.com/...',
            SUMMARY_PLACEHOLDER: 'Final year student/New graduate in... seeking an Intern/Fresher opportunity.',
            JOB_TITLE_PLACEHOLDER: 'Position/Title',
            COMPANY_PLACEHOLDER: 'Company/Organization Name',
            AT: 'at',
            TIME_PLACEHOLDER: 'Time: MM/YYYY - Present/MM/YYYY',
            EXP_DESC_PLACEHOLDER: '* Describe primary duties, focusing on results achieved.\n* Use metrics (if applicable): Optimized [X] processes/reduced [Y]% errors.',
            PROJECT_NAME_PLACEHOLDER: 'Project/Personal Project Name',
            PROJ_DESC_PLACEHOLDER: '* Built a [Type of application] using [Main Technology A].\n* Quantified result: Project processed [X] records/reduced [Y]% processing time.',
            UNIVERSITY: 'University:',
            UNIVERSITY_PLACEHOLDER: 'University Name',
            MAJOR: 'Major:',
            MAJOR_PLACEHOLDER: 'Major Name',
            TIME: 'Time:',
            START_YEAR_PLACEHOLDER: 'Start Year',
            END_YEAR_PLACEHOLDER: 'Graduation Year',
            PROFESSIONAL_SKILLS: 'Professional Skills:',
            SOFT_SKILLS: 'Soft Skills:',
            OTHER_EXP_PLACEHOLDER: '* Short-term Internship/Freelance: [Company/Project Name].\n* Award: [Award Name] in [Competition Name] programming competition.\n* Certificate: [Certificate Name].',
            NEW_PROJECT: 'New Project',
            NEW_EDUCATION: 'New University',
            NEW_EXPERIENCE: 'New Position',
            COMPANY: 'Company Name',
        }
    }
};

const defaultCvSections: CvSection[] = [
    { id: 'summary', title: 'Mục tiêu Nghề nghiệp', componentKey: 'SUMMARY', isRemovable: true, isVisible: true },
    { id: 'experience', title: 'Kinh nghiệm Làm việc', componentKey: 'EXPERIENCE', isRemovable: true, isVisible: true },
    { id: 'projects', title: 'Dự án', componentKey: 'PROJECTS', isRemovable: true, isVisible: true },
    { id: 'education', title: 'Học vấn', componentKey: 'EDUCATION', isRemovable: true, isVisible: true },
    { id: 'skills', title: 'Kỹ năng Chuyên môn', componentKey: 'SKILLS', isRemovable: true, isVisible: true },
    { id: 'activities', title: 'Kinh nghiệm Khác', componentKey: 'ACTIVITIES', isRemovable: true, isVisible: false },
];

interface AutosizeTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AutosizeTextArea: React.FC<AutosizeTextAreaProps> = ({ value, onChange, placeholder, ...props }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const element = textAreaRef.current;
        if (element) {
            element.style.height = '0px';
            element.style.height = element.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <textarea
            ref={textAreaRef}
            className="cv-textarea"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
        />
    );
};


const FreshInternCVTemplate = forwardRef<HTMLDivElement, FreshInternCVTemplateProps>(({ settings, cvData, updateCvData }, ref) => {

    const lang = settings.lang === 'en' ? 'en' : 'vi';
    const T = translations[lang];

    const sanitizeColor = (color: string): string => {
        if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
            return color;
        }
        if (color.includes('oklch') || color.includes('lch')) {
            return '#059669';
        }
        return color || '#059669';
    };

    const safeColor = sanitizeColor(settings.color);

    const cvStyle = { fontFamily: settings.fontFamily };
    const headerStyle = { color: safeColor, fontFamily: settings.fontFamily, fontWeight: 'bold' };
    const h1BorderStyle = { color: safeColor, fontFamily: settings.fontFamily };

    const [jobTitle, setJobTitle] = useState<string>("");
    const [showEmail, setShowEmail] = useState(true);
    const [showPhone, setShowPhone] = useState(true);
    const [showLinkedln, setShowLinkedln] = useState(true);
    const [showGithub, setShowGithub] = useState(true);

    const [openModalSummary, setOpenModalSummary] = useState<boolean>(false);
    const [openModalEx, setOpenModalEx] = useState<boolean>(false);
    const [openModalDesProject, setOpenModalDesProject] = useState<boolean>(false);

    const closeCVAIModalSummary = () => {
        setOpenModalSummary(false);
    };

    const turnOnRecomendSummary = () => {
        setOpenModalSummary(true);
    };

    const closeCVAIModalEx = () => {
        setOpenModalEx(false);
    };

    const turnOnRecomendEx = () => {
        setOpenModalEx(true);
    };

    const closeCVAIModalDesProject = () => {
        setOpenModalDesProject(false);
    };

    const turnOnRecomendDesProject = () => {
        setOpenModalDesProject(true);
    };

    const [profInput, setProfInput] = useState("");
    const [softInput, setSoftInput] = useState("");
    const [filteredProfSkills, setFilteredProfSkills] = useState<string[]>([]);
    const [filteredSoftSkills, setFilteredSoftSkills] = useState<string[]>([]);
    const [showProfSuggestion, setShowProfSuggestion] = useState(false);
    const [showSoftSuggestion, setShowSoftSuggestion] = useState(false);

    const skillsArray = (skillsString: string): string[] => {
        try {
            return skillsString ? JSON.parse(skillsString) : [];
        } catch {
            return skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
    };

    const professionalSkillOptions = [
        // Frontend
        "ReactJS",
        "React Native",
        "Vue.js",
        "Angular",
        "Svelte",
        "HTML5",
        "CSS3",
        "JavaScript",
        "TypeScript",
        "Next.js",
        "Nuxt.js",
        // Backend
        "Node.js",
        "Express",
        "NestJS",
        "Spring Boot",
        "Java",
        "Python",
        "Django",
        "Flask",
        "Ruby on Rails",
        "PHP",
        "Laravel",
        "Go",
        "C",
        "C++",
        "C#",
        ".NET",
        // Database
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Redis",
        "DynamoDB",
        "Firebase",
        "MSSQL",
        // DevOps / Cloud
        "AWS",
        "Azure",
        "GCP",
        "Docker",
        "Kubernetes",
        "Terraform",
        "CI/CD",
        "Git",
        "Linux",
        // Mobile
        "Swift",
        "Objective-C",
        "Kotlin",
        "Flutter",
        // AI / ML / Data
        "Python",
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "Pandas",
        "NumPy",
        "Machine Learning",
        "Deep Learning",
        // Others
        "REST API",
        "GraphQL",
        "WebSockets",
        "Microservices",
        "Unit Testing",
        "Jest",
        "Cypress",
        "Agile",
        "Scrum",
    ];

    const softSkillOptions = [
        "Teamwork",
        "Communication",
        "Problem Solving",
        "Critical Thinking",
        "Leadership",
        "Time Management",
        "Adaptability",
        "Creativity",
        "Conflict Resolution",
        "Emotional Intelligence",
        "Collaboration",
        "Decision Making",
        "Analytical Thinking",
        "Presentation Skills",
        "Negotiation",
        "Attention to Detail",
        "Flexibility",
        "Motivation",
        "Work Ethic",
        "Active Listening",
        "Networking",
        "Persuasion",
        "Stress Management",
        "Self-Discipline",
    ];

    const currentProfSkills = skillsArray(cvData.professionalSkills);
    const currentSoftSkills = skillsArray(cvData.softSkills);

    const updateSkills = (skills: string[], type: 'professionalSkills' | 'softSkills') => {
        updateCvData(type, JSON.stringify(skills));
    };

    const addProfSkill = (skill: string) => {
        if (!currentProfSkills.includes(skill)) {
            const newSkills = [...currentProfSkills, skill];
            updateSkills(newSkills, 'professionalSkills');
        }
        setProfInput("");
        setFilteredProfSkills([]);
    };

    const handleRemoveProfSkill = (skill: string) => {
        const newSkills = currentProfSkills.filter((s: string) => s !== skill);
        updateSkills(newSkills, 'professionalSkills');
    };

    const addSoftSkill = (skill: string) => {
        if (!currentSoftSkills.includes(skill)) {
            const newSkills = [...currentSoftSkills, skill];
            updateSkills(newSkills, 'softSkills');
        }
        setSoftInput("");
        setFilteredSoftSkills([]);
    };

    const handleRemoveSoftSkill = (skill: string) => {
        const newSkills = currentSoftSkills.filter((s: string) => s !== skill);
        updateSkills(newSkills, 'softSkills');
    };

    const handleProfFocus = () => setShowProfSuggestion(true);
    const handleSoftFocus = () => setShowSoftSuggestion(true);
    const handleProfBlur = () => setTimeout(() => setShowProfSuggestion(false), 200);
    const handleSoftBlur = () => setTimeout(() => setShowSoftSuggestion(false), 200);

    const handleProfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProfInput(value);
        setFilteredProfSkills(professionalSkillOptions.filter((opt) => opt.toLowerCase().includes(value.toLowerCase())));
    };

    const handleSoftInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSoftInput(value);
        setFilteredSoftSkills(softSkillOptions.filter((opt) => opt.toLowerCase().includes(value.toLowerCase())));
    };

    const handleProfKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && profInput.trim() !== "") {
            addProfSkill(profInput.trim());
            e.preventDefault();
        }
    };

    const handleSoftKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && softInput.trim() !== "") {
            addSoftSkill(softInput.trim());
            e.preventDefault();
        }
    };

    const handleSelectProfSkill = (skill: string) => {
        addProfSkill(skill);
        setShowProfSuggestion(false);
    };

    const handleSelectSoftSkill = (skill: string) => {
        addSoftSkill(skill);
        setShowSoftSuggestion(false);
    };

    const [cvSections, setCvSections] = useState<CvSection[]>(defaultCvSections);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        setDraggedItemId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, droppedId: string) => {
        e.preventDefault();
        if (!draggedItemId || draggedItemId === droppedId) {
            setDraggedItemId(null);
            return;
        }

        const newSections = [...cvSections];
        const draggedIndex = newSections.findIndex(s => s.id === draggedItemId);
        const droppedIndex = newSections.findIndex(s => s.id === droppedId);

        if (draggedIndex === -1 || droppedIndex === -1) return;

        const [draggedItem] = newSections.splice(draggedIndex, 1);
        newSections.splice(droppedIndex, 0, draggedItem);

        setCvSections(newSections);
        setDraggedItemId(null);
    };

    const handleRemoveSection = (id: string) => {
        setCvSections(prev => prev.map(s => s.id === id ? { ...s, isVisible: false } : s));
    };

    const handleAddSection = (id: string) => {
        setCvSections(prev => prev.map(s => s.id === id ? { ...s, isVisible: true } : s));
    };

    // Contact
    const updateContactField = (field: keyof ContactInfo, value: string) => {
        const updatedContact = { ...cvData.contact, [field]: value };
        updateCvData('contact', updatedContact);
    };

    // Project
    const updateProjectField = (index: number, field: keyof Project, value: string) => {
        const updatedProjects = Array.isArray(cvData.projects) ? [...cvData.projects] : [];
        if (!updatedProjects[index]) return;
        updatedProjects[index] = { ...updatedProjects[index], [field]: value };
        updateCvData('projects', updatedProjects);
    };

    const addProject = () => {
        const newProject: Project = { projectName: T.PHRASES.NEW_PROJECT, projectDescription: '' };
        const projects = Array.isArray(cvData.projects) ? cvData.projects : [];
        updateCvData('projects', [...projects, newProject]);
    };

    // Education
    const updateEducationField = (index: number, field: keyof Education, value: string) => {
        const updatedEducation = Array.isArray(cvData.education) ? [...cvData.education] : [];
        if (!updatedEducation[index]) return;
        updatedEducation[index] = { ...updatedEducation[index], [field]: value };
        updateCvData('education', updatedEducation);
    };

    const addEducation = () => {
        const newEducation: Education = { university: T.PHRASES.NEW_EDUCATION, major: '', gpa: '', startYear: '', endYear: '' };
        const education = Array.isArray(cvData.education) ? cvData.education : [];
        updateCvData('education', [...education, newEducation]);
    };

    // Experience
    const updateExperienceField = (index: number, field: keyof Experience, value: string) => {
        const updatedExperience = Array.isArray(cvData.experience) ? [...cvData.experience] : [];
        if (!updatedExperience[index]) return;
        updatedExperience[index] = { ...updatedExperience[index], [field]: value };
        updateCvData('experience', updatedExperience);
    };

    const addExperience = () => {
        const newExperience: Experience = { jobTitle: T.PHRASES.NEW_EXPERIENCE, company: T.PHRASES.COMPANY, startDate: '', endDate: '', description: '' };
        const experience = Array.isArray(cvData.experience) ? cvData.experience : [];
        updateCvData('experience', [...experience, newExperience]);
    };

    const updateFieldInArray = <T,>(arrayName: keyof CVData, index: number, field: keyof T, value: string) => {
        const array = (cvData[arrayName] as T[] || []).slice();
        if (array[index]) {
            array[index] = { ...array[index], [field]: value };
            updateCvData(arrayName, array);
        }
    };

    const removeFromArray = (arrayName: keyof CVData, index: number) => {
        updateCvData(arrayName, (cvData[arrayName] as any[] || []).filter((_, i) => i !== index));
    };

    const renderProjectEntry = (project: Project, index: number) => {
        return (
            <div key={index} className="job-entry border-l-4 relative group">
                <input type="text"
                    style={{ fontFamily: settings.fontFamily }}
                    className="project-title input-cv-value font-bold"
                    value={project.projectName || ''}
                    onChange={(e) => updateProjectField(index, 'projectName', e.target.value)}
                    placeholder={T.PHRASES.PROJECT_NAME_PLACEHOLDER} />

                {openModalDesProject && (
                    <div className="box-ai-recomend">
                        {
                            <Modal_AI_Recomend
                                content={project.projectDescription}
                                onClose={closeCVAIModalDesProject}
                                type="ProjectDescription"
                                onApply={(suggestion) => {
                                    updateFieldInArray('projects', index, 'projectDescription', suggestion);
                                    closeCVAIModalDesProject();
                                }}
                            />
                        }
                    </div>
                )}

                <AutosizeTextArea
                    value={project.projectDescription || ''}
                    style={{ fontFamily: settings.fontFamily }}
                    onChange={(e) => updateProjectField(index, 'projectDescription', e.target.value)}
                    placeholder={T.PHRASES.PROJ_DESC_PLACEHOLDER}
                />
                <button className='cv-editor-control' onClick={() => removeFromArray('projects', index)}>{T.PHRASES.REMOVE}</button>
            </div>
        );
    };

    const renderEducationEntry = (education: Education, index: number) => {
        return (
            <div key={index} className="education-entry flex flex-col gap-1.5 relative group">
                <div className='flex items-center gap-2.5'>
                    <span><strong style={{ fontFamily: settings.fontFamily }}>{T.PHRASES.UNIVERSITY}</strong></span>
                    <input type="text"
                        className='input-cv-value flex-1 font-bold'
                        style={{ fontFamily: settings.fontFamily }}
                        value={education.university}
                        onChange={(e) => updateEducationField(index, 'university', e.target.value)}
                        placeholder={T.PHRASES.UNIVERSITY_PLACEHOLDER} />
                </div>
                <div className='flex items-center gap-2.5'>
                    <span><strong style={{ fontFamily: settings.fontFamily }}>{T.PHRASES.MAJOR}</strong></span>
                    <input type="text"
                        style={{ fontFamily: settings.fontFamily }}
                        className='input-cv-value flex-1'
                        value={education.major}
                        onChange={(e) => updateEducationField(index, 'major', e.target.value)}
                        placeholder={T.PHRASES.MAJOR_PLACEHOLDER} />
                </div>
                <div className="company-date flex items-center gap-2.5">
                    <span><strong style={{ fontFamily: settings.fontFamily }}>{T.PHRASES.TIME}</strong></span>
                    <div className='flex items-center gap-3.5'>
                        <input type="number"
                            style={{ fontFamily: settings.fontFamily }}
                            className='input-cv-value input-year'
                            value={education.startYear}
                            onChange={(e) => {
                                updateEducationField(index, 'startYear', e.target.value);
                            }}
                            placeholder={T.PHRASES.START_YEAR_PLACEHOLDER}
                            min="1950"
                            max={new Date().getFullYear()}
                        />
                        <span> - </span>
                        <input type="number"
                            style={{ fontFamily: settings.fontFamily }}
                            className='input-cv-value input-year'
                            value={education.endYear}
                            onChange={(e) => {
                                updateEducationField(index, 'endYear', e.target.value);
                            }}
                            placeholder={T.PHRASES.END_YEAR_PLACEHOLDER}
                            min={education.startYear || 1950}
                            max={new Date().getFullYear() + 5}
                        />
                    </div>
                </div>
                <div className='flex items-center gap-2.5'>
                    <span><strong style={{ fontFamily: settings.fontFamily }}>GPA:</strong></span>
                    <input type="text"
                        style={{ fontFamily: settings.fontFamily }}
                        className='input-cv-value flex-1'
                        value={education.gpa}
                        onChange={(e) => updateEducationField(index, 'gpa', e.target.value)}
                        placeholder=".../4"
                    />
                </div>
                <button className='cv-editor-control' onClick={() => removeFromArray('education', index)}>{T.PHRASES.REMOVE}</button>
            </div>
        );
    };

    const renderExperienceEntry = (exp: Experience, index: number) => {
        return (
            <div key={index} className="job-entry border-l-4 border-gray-300 relative group">
                <div className='flex items-baseline gap-2.5'>
                    <input type="text"
                        style={{ fontFamily: settings.fontFamily }}
                        className='input-cv-value flex-1 font-bold'
                        value={exp.jobTitle || ''}
                        onChange={(e) => updateExperienceField(index, 'jobTitle', e.target.value)}
                        placeholder={T.PHRASES.JOB_TITLE_PLACEHOLDER} />
                    <span style={{ fontFamily: settings.fontFamily }}>{T.PHRASES.AT}</span>
                    <input type="text"
                        style={{ fontFamily: settings.fontFamily }}
                        className='input-cv-value flex-1'
                        value={exp.company || ''}
                        onChange={(e) => updateExperienceField(index, 'company', e.target.value)}
                        placeholder={T.PHRASES.COMPANY_PLACEHOLDER} />
                </div>
                <div className="company-date flex items-baseline gap-2.5 text-sm italic">
                    <input type="text"
                        style={{ fontFamily: settings.fontFamily }}
                        className='input-cv-value'
                        value={exp.startDate}
                        onChange={(e) => {
                            const [start = '', end = ''] = e.target.value.split('-').map(s => s.trim());
                            updateExperienceField(index, 'startDate', start);
                            updateExperienceField(index, 'endDate', end);
                        }}
                        placeholder={T.PHRASES.TIME_PLACEHOLDER}
                    />
                </div>

                {openModalEx && (
                    <div className="box-ai-recomend">
                        {
                            <Modal_AI_Recomend
                                content={exp.description}
                                onClose={closeCVAIModalEx}
                                type="Experience"
                                onApply={(suggestion) => {
                                    updateFieldInArray('experience', index, 'description', suggestion);
                                    closeCVAIModalEx();
                                }}
                            />
                        }
                    </div>
                )}

                <AutosizeTextArea // Sử dụng component Autosize đã sửa
                    value={exp.description || ''}
                    onChange={(e) => updateExperienceField(index, 'description', e.target.value)}
                    placeholder={T.PHRASES.EXP_DESC_PLACEHOLDER}
                />
                <button className='cv-editor-control' onClick={() => removeFromArray('experience', index)}>{T.PHRASES.REMOVE}</button>
            </div>
        );
    };

    const renderSectionComponent = (key: CvSection['componentKey']) => {
        const experiences = Array.isArray(cvData.experience) ? cvData.experience : [];
        const projects = Array.isArray(cvData.projects) ? cvData.projects : [];
        const education = Array.isArray(cvData.education) ? cvData.education : [];
        const sectionTitle = T.SECTIONS[key];

        switch (key) {
            case 'SUMMARY':
                return (
                    <section className="summary">
                        <div className='flex justify-between box-head'>
                            <h2 style={headerStyle}>{sectionTitle.toUpperCase()}</h2>
                            <div className="ai-suggestion-btn" onClick={turnOnRecomendSummary} title={T.PHRASES.AI_SUGGESTION}>
                                {T.PHRASES.AI_SUGGESTION}
                            </div>
                            {openModalSummary && (
                                <div className="box-ai-recomend">
                                    {
                                        <Modal_AI_Recomend
                                            content={cvData.introduction}
                                            onClose={closeCVAIModalSummary}
                                            type="Summary"
                                            onApply={(suggestion) => {
                                                updateCvData('introduction', suggestion);
                                                closeCVAIModalSummary();
                                            }}
                                        />
                                    }
                                </div>
                            )}
                        </div>
                        <AutosizeTextArea
                            value={cvData.introduction}
                            onChange={(e) => updateCvData('introduction', e.target.value)}
                            placeholder={T.PHRASES.SUMMARY_PLACEHOLDER}
                        />
                    </section>
                );

            case 'EXPERIENCE':
                return (
                    <section className="experience">
                        <div className='flex justify-between box-head'>
                            <h2 style={headerStyle}>{sectionTitle.toUpperCase()}</h2>
                            <div className="ai-suggestion-btn" onClick={turnOnRecomendEx} title={T.PHRASES.AI_SUGGESTION}>
                                {T.PHRASES.AI_SUGGESTION}
                            </div>
                        </div>
                        {experiences.map(renderExperienceEntry)}
                        <button className='cv-editor-control cv-add-control' onClick={addExperience}>{T.PHRASES.ADD} {T.SECTIONS.EXPERIENCE}</button>
                    </section>
                );

            case 'PROJECTS':
                return (
                    <section className="projects">
                        <div className='flex justify-between box-head'>
                            <h2 style={headerStyle}>{sectionTitle.toUpperCase()}</h2>
                            <div className="ai-suggestion-btn" onClick={turnOnRecomendDesProject} title={T.PHRASES.AI_SUGGESTION}>
                                {T.PHRASES.AI_SUGGESTION}
                            </div>
                        </div>
                        {projects.map(renderProjectEntry)}
                        <button className='cv-editor-control cv-add-control' onClick={addProject}>{T.PHRASES.ADD} {T.SECTIONS.PROJECTS}</button>
                    </section>
                );

            case 'EDUCATION':
                return (
                    <section className="education">
                        <h2 style={headerStyle}>{sectionTitle.toUpperCase()}</h2>
                        {education.map(renderEducationEntry)}
                        <button className='cv-editor-control cv-add-control' onClick={addEducation}>{T.PHRASES.ADD} {T.SECTIONS.EDUCATION}</button>
                    </section>
                );

            case 'SKILLS':
                return (
                    <section className="skills">
                        <h2 style={headerStyle}>{sectionTitle.toUpperCase()}</h2>
                        <div className="skills-list flex flex-col gap-1.5">
                            {/* Kỹ năng chuyên môn */}
                            <div className='flex items-baseline gap-1 skill-line'>
                                <span><strong style={{ fontFamily: settings.fontFamily }}>{T.PHRASES.PROFESSIONAL_SKILLS}</strong></span>
                                <div className='flex gap-2 flex-wrap flex-1 relative'>
                                    {currentProfSkills.map((skill: string) => (
                                        <span className="tag flex items-center gap-1" key={skill} style={{ background: 'none', color: '#000', fontWeight: 'normal', fontFamily: settings.fontFamily }} >
                                            {skill}{" "}
                                            <span className='tag-remove' onClick={() => handleRemoveProfSkill(skill)}>x</span>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        className='input-cv-value flex-1 min-w-[150px]'
                                        value={profInput}
                                        onChange={handleProfInputChange}
                                        onFocus={handleProfFocus}
                                        onBlur={handleProfBlur}
                                        onKeyDown={handleProfKeyDown}
                                    />
                                    {showProfSuggestion && filteredProfSkills.length > 0 && (
                                        <ul className="suggestion-list absolute z-10 w-full max-h-40 overflow-y-auto mt-8"
                                            style={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db' }}
                                        >
                                            {filteredProfSkills.map((skill) => (
                                                <li
                                                    key={skill}
                                                    onMouseDown={() => handleSelectProfSkill(skill)}
                                                    className="p-1 cursor-pointer"
                                                >
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {/* Kỹ năng mềm */}
                            <div className='flex items-baseline gap-1 skill-line'>
                                <span><strong style={{ fontFamily: settings.fontFamily }}>{T.PHRASES.SOFT_SKILLS}</strong></span>
                                <div className='flex gap-2 flex-wrap flex-1 relative'>
                                    {currentSoftSkills.map((skill: string) => (
                                        <span className="tag" key={skill} style={{ background: 'none', color: '#000', fontWeight: 'normal', fontFamily: settings.fontFamily }} >
                                            {skill}{" "}
                                            <span className='tag-remove' onClick={() => handleRemoveSoftSkill(skill)}>x</span>
                                        </span>
                                    ))}
                                    <input type="text"
                                        className='input-cv-value flex-1 min-w-[150px]'
                                        value={softInput}
                                        onChange={handleSoftInputChange}
                                        onFocus={handleSoftFocus}
                                        onBlur={handleSoftBlur}
                                        onKeyDown={handleSoftKeyDown}
                                    />
                                    {showSoftSuggestion && filteredSoftSkills.length > 0 && (
                                        <ul className="suggestion-list absolute z-10 w-full max-h-40 overflow-y-auto mt-8"
                                            style={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db' }}
                                        >
                                            {filteredSoftSkills.map((skill) => (
                                                <li
                                                    key={skill}
                                                    onMouseDown={() => handleSelectSoftSkill(skill)}
                                                    className="p-1 cursor-pointer"
                                                >
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                );

            case 'ACTIVITIES':
                return (
                    <section className="activities">
                        <h2 style={headerStyle}>{sectionTitle.toUpperCase()}</h2>
                        <AutosizeTextArea // Sử dụng AutosizeTextArea
                            value={cvData.activitiesAwards}
                            style={{ fontFamily: settings.fontFamily }}
                            onChange={(e) => updateCvData('activitiesAwards', e.target.value)}
                            placeholder={T.PHRASES.OTHER_EXP_PLACEHOLDER}
                        />
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="add-section-ui flex gap-2 flex-wrap shadow-2xl rounded-sm" style={{ marginBottom: 15, padding: 15, backgroundColor: '#fff' }}>
                <strong>{T.PHRASES.ADD_SECTION}</strong>
                {defaultCvSections.filter(s => !cvSections.find(cs => cs.id === s.id && cs.isVisible))
                    .map(hiddenSection => (
                        <button
                            key={hiddenSection.id}
                            className='cv-editor-control cv-add-control'
                            onClick={() => handleAddSection(hiddenSection.id)}
                        >
                            {T.PHRASES.ADD} {translations.vi.SECTIONS[hiddenSection.componentKey]}
                        </button>
                    ))}
            </div>

            <div className="cv-container" style={cvStyle} ref={ref}>
                {/* 1. HEADER & CONTACT (GIỮ CỐ ĐỊNH, KHÔNG KÉO THẢ) */}
                <header className="cv-header">
                    <input className='cv-header-inputname input-cv-value'
                        style={h1BorderStyle}
                        value={cvData.name}
                        onChange={(e) => updateCvData('name', e.target.value)}
                        placeholder={T.PHRASES.NAME}
                    />

                    <hr style={{
                        border: 'none',
                        height: '2px',
                        backgroundColor: safeColor
                    }} />

                    <input className="title input-cv-value"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder={T.PHRASES.JOB_TITLE}
                        style={{ fontFamily: settings.fontFamily }}
                    />
                </header>

                <section className="contact-info flex gap-5 flex-wrap">
                    {/* EMAIL */}
                    {showEmail &&
                        (<div className='flex items-center gap-1 contact-info_item'>
                            <MdAlternateEmail size={18} color={settings.color}/>
                            <input className='input-cv-value input-email'
                                style={{ fontFamily: settings.fontFamily, width: 'fit-content', minWidth: '170px' }} 
                                type="text" value={cvData.contact.email}
                                onChange={(e) => updateContactField('email', e.target.value)}
                                placeholder="email@example.com"
                            />
                            <button className='cv-editor-control cv-del-control' onClick={() => setShowEmail(false)}>{T.PHRASES.HIDE}</button>
                        </div>
                        )}
                    {!showEmail && <button className='cv-editor-control cv-add-control' onClick={() => setShowEmail(true)}>{T.PHRASES.ADD} {T.PHRASES.EMAIL.replace(':', '')}</button>}

                    {/* SỐ ĐIỆN THOẠI */}
                    {showPhone &&
                        (<div className='flex items-center gap-1 contact-info_item'>
                            <FaPhoneAlt color={settings.color} size={14}/>
                            <input className='input-cv-value input-phone'
                                style={{ fontFamily: settings.fontFamily }}
                                type="text" value={cvData.contact.phone}
                                onChange={(e) => updateContactField('phone', e.target.value)}
                                placeholder={T.PHRASES.PHONE_PLACEHOLDER} />
                            <button className='cv-editor-control cv-del-control' onClick={() => setShowPhone(false)}>{T.PHRASES.HIDE}</button>
                        </div>
                        )}
                    {!showPhone && <button className='cv-editor-control cv-add-control' onClick={() => setShowPhone(true)}>{T.PHRASES.ADD} {T.PHRASES.PHONE.replace(':', '')}</button>}

                    {/* LINKEDIN (sử dụng website trong data) */}
                    {showLinkedln &&
                        (<div className='flex items-baseline gap-1 contact-info_item'>
                            <FaLink color={settings.color} size={16} />
                            <input className='input-cv-value'
                                type="text"
                                value={cvData.contact.website}
                                // KHẮC PHỤC LỖI KHUẤT NỘI DUNG
                                style={{ fontFamily: settings.fontFamily, width: 'fit-content', minWidth: '150px' }}
                                onChange={(e) => updateContactField('website', e.target.value)} placeholder={T.PHRASES.LINKEDIN_PLACEHOLDER} />
                            <button className='cv-editor-control cv-del-control' onClick={() => setShowLinkedln(false)}>{T.PHRASES.HIDE}</button>
                        </div>
                        )}
                    {!showLinkedln && <button className='cv-editor-control cv-add-control' onClick={() => setShowLinkedln(true)}>{T.PHRASES.ADD} {T.PHRASES.LINKEDIN.replace(':', '')}</button>}

                    {/* GITHUB/PORTFOLIO */}
                    {showGithub &&
                        (<div className='flex items-baseline gap-0.5 contact-info_item'>
                            <FaLink color={settings.color} size={16} />
                            <input className='input-cv-value'
                                type="text"
                                value={cvData.contact.github}
                                // KHẮC PHỤC LỖI KHUẤT NỘI DUNG
                                style={{ fontFamily: settings.fontFamily, width: 'fit-content', minWidth: '150px' }}
                                onChange={(e) => updateContactField('github', e.target.value)} placeholder={T.PHRASES.GITHUB_PLACEHOLDER} />
                            <button className='cv-editor-control cv-del-control' onClick={() => setShowGithub(false)}>{T.PHRASES.HIDE}</button>
                        </div>
                        )}
                    {!showGithub && <button className='cv-editor-control cv-add-control' onClick={() => setShowGithub(true)}>{T.PHRASES.ADD} {T.PHRASES.GITHUB_PORTFOLIO.split('/')[0].replace(':', '')}</button>}
                </section>

                {/* 2. LẶP QUA CÁC SECTION CÓ THỂ KÉO THẢ */}
                {cvSections.map((section) => (
                    section.isVisible ? (
                        <div
                            key={section.id}
                            data-id={section.id}
                            draggable={section.isRemovable}
                            onDragStart={(e) => handleDragStart(e, section.id)}
                            onDrop={(e) => handleDrop(e, section.id)}
                            onDragOver={handleDragOver}
                            className={`cv-section-draggable-wrapper ${draggedItemId === section.id ? 'is-dragging' : ''}`}
                            style={draggedItemId === section.id ? { border: '1px dashed #9ca3af' } : {}}
                        >
                            {/* TOOLBAR ĐIỀU KHIỂN ĐÃ SỬA LỖI */}
                            <div className="cv-section-controls">
                                {section.isRemovable && (
                                    <>
                                        {/* Drag Handle */}
                                        <span className="drag-handle" style={{ cursor: 'grab' }}>:: KÉO ::</span>
                                        {/* Nút Xóa/Ẩn */}
                                        <div
                                            className='sections-controls_del'
                                            onClick={() => handleRemoveSection(section.id)}
                                        >
                                            {T.PHRASES.REMOVE}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* NỘI DUNG SECTION */}
                            {renderSectionComponent(section.componentKey)}
                        </div>
                    ) : null
                ))}
            </div>
        </>
    );
}
);

export default FreshInternCVTemplate;