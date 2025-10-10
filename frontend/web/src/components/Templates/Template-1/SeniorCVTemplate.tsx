import React, { useState, forwardRef, useRef, useEffect } from 'react';
import './SeniorCVTemplate.css';

export interface CvSection {
    id: string;
    title: string;
    componentKey: 'SUMMARY' | 'PROJECTS' | 'EDUCATION' | 'SKILLS' | 'ACTIVITIES';
    isRemovable: boolean;
    isVisible: boolean;
}

const defaultCvSections: CvSection[] = [
    { id: 'summary', title: 'Mục tiêu Nghề nghiệp', componentKey: 'SUMMARY', isRemovable: true, isVisible: true },
    { id: 'projects', title: 'Dự án', componentKey: 'PROJECTS', isRemovable: true, isVisible: true },
    { id: 'education', title: 'Học vấn', componentKey: 'EDUCATION', isRemovable: true, isVisible: true },
    { id: 'skills', title: 'Kỹ năng Chuyên môn', componentKey: 'SKILLS', isRemovable: true, isVisible: true },
    { id: 'activities', title: 'Kinh nghiệm Khác', componentKey: 'ACTIVITIES', isRemovable: true, isVisible: true },
];

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
    experience: string;
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

const FreshInternCVTemplate = forwardRef<HTMLDivElement, FreshInternCVTemplateProps>(({ settings, cvData, updateCvData }, ref) => {

    const cvStyle = { fontFamily: settings.fontFamily };
    const headerStyle = { color: settings.color };
    const h1BorderStyle = { borderBottom: `3px solid ${settings.color}`, paddingBottom: '5px', color: `${settings.color}` };

    const [jobTitle, setJobTitle] = useState<string>("");
    const [showEmail, setShowEmail] = useState(true);
    const [showPhone, setShowPhone] = useState(true);
    const [showLinkedln, setShowLinkedln] = useState(true);
    const [showGithub, setShowGithub] = useState(true);

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
        // Database
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Redis",
        "DynamoDB",
        "Firebase",
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

    const [profSkills, setProfSkills] = useState<string[]>([]);
    const [softSkills, setSoftSkills] = useState<string[]>([]);
    const [profInput, setProfInput] = useState("");
    const [softInput, setSoftInput] = useState("");
    const [filteredProfSkills, setFilteredProfSkills] = useState<string[]>([]);
    const [filteredSoftSkills, setFilteredSoftSkills] = useState<string[]>([]);
    const [showProfSuggestion, setShowProfSuggestion] = useState(false);
    const [showSoftSuggestion, setShowSoftSuggestion] = useState(false);

    const skillsArray = (skillsString: string) => {
        try {
            // Giả định lưu dưới dạng JSON String Array
            return skillsString ? JSON.parse(skillsString) : [];
        } catch {
            // Trường hợp lỗi parse hoặc lưu dưới dạng chuỗi 'skill1, skill2'
            return skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
    };

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


    // Focus
    const handleProfFocus = () => setShowProfSuggestion(true);
    const handleSoftFocus = () => setShowSoftSuggestion(true);

    // Blur
    const handleProfBlur = () => setShowProfSuggestion(false);
    const handleSoftBlur = () => setShowSoftSuggestion(false);

    // Input change
    const handleProfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProfInput(value);
        setFilteredProfSkills(
            professionalSkillOptions.filter((opt) =>
                opt.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleSoftInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSoftInput(value);
        setFilteredSoftSkills(
            softSkillOptions.filter((opt) =>
                opt.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    // const addProfSkill = (skill: string) => {
    //     if (!profSkills.includes(skill)) {
    //         setProfSkills([...profSkills, skill]);
    //     }
    //     setProfInput("");
    //     setFilteredProfSkills([]);
    // };

    // const addSoftSkill = (skill: string) => {
    //     if (!softSkills.includes(skill)) {
    //         setSoftSkills([...softSkills, skill]);
    //     }
    //     setSoftInput("");
    //     setFilteredSoftSkills([]);
    // };

    // handle Enter key
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

    // Select skill
    const handleSelectProfSkill = (skill: string) => {
        if (!profSkills.includes(skill)) {
            const newSkills = [...profSkills, skill];
            setProfSkills(newSkills);
            // setCvData((prev) => ({
            //     ...prev,
            //     professionalSkills: newSkills.join(","),
            // }));
        }
        setProfInput("");
        setShowProfSuggestion(false);
    };

    const handleSelectSoftSkill = (skill: string) => {
        if (!softSkills.includes(skill)) {
            const newSkills = [...softSkills, skill];
            setSoftSkills(newSkills);
            // setCvData((prev) => ({ ...prev, softSkills: newSkills.join(",") }));
        }
        setSoftInput("");
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

        // Di chuyển item
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

    const updateProjectField = (index: number, field: keyof Project, value: string) => {
        const updatedProjects = [...cvData.projects];

        updatedProjects[index] = {
            ...updatedProjects[index],
            [field]: value
        };

        updateCvData('projects', updatedProjects);
    };

    const updateEducationField = (index: number, field: keyof Education, value: string) => {
        const updatedEducation = [...cvData.education];

        updatedEducation[index] = {
            ...updatedEducation[index],
            [field]: value
        };

        updateCvData('education', updatedEducation);
    };

    const updateContactField = (field: keyof ContactInfo, value: string) => {
        const updatedContact = {
            ...cvData.contact,
            [field]: value
        };

        updateCvData('contact', updatedContact);
    };

    const renderSectionComponent = (key: CvSection['componentKey']) => {
        switch (key) {
            case 'SUMMARY':
                const summaryRef = useRef<HTMLTextAreaElement>(null);

                useEffect(() => {
                    const element = summaryRef.current;
                    if (element) {
                        element.style.height = '0px';
                        element.style.height = element.scrollHeight + 'px';
                    }
                }, [cvData.introduction]);

                return (
                    <section className="summary">
                        <h2 style={headerStyle}>MỤC TIÊU NGHỀ NGHIỆP</h2>
                        <textarea
                            ref={summaryRef}
                            className="cv-textarea"
                            value={cvData.introduction}
                            onChange={(e) => updateCvData('introduction', e.target.value)}
                            // rows={4}
                            placeholder='Sinh viên năm cuối/Mới tốt nghiệp chuyên ngành [Tên ngành] với GPA cao (nếu có). Đam mê và có kinh nghiệm thực hành với [Công nghệ Chính] qua các dự án. Sẵn sàng học hỏi, có tinh thần trách nhiệm cao, tìm kiếm cơ hội Intern/Fresher để áp dụng kiến thức và phát triển kỹ năng chuyên môn.'
                        />
                    </section>
                );
            case 'PROJECTS':

                const currentProject = cvData.projects[0];
                const projectRef = useRef<HTMLTextAreaElement>(null);

                useEffect(() => {
                    const element = projectRef.current;
                    if (element) {
                        element.style.height = '0px';
                        element.style.height = element.scrollHeight + 'px';
                    }
                }, [cvData.projects[0]]);

                return (
                    <section className="projects">
                        <h2 style={headerStyle}>DỰ ÁN</h2>
                        <div className="job-entry">
                            <input type="text"
                                className="project-title input-cv-value"
                                value={currentProject?.projectName || ''}
                                onChange={(e) => updateProjectField(0, 'projectName', e.target.value)}
                                placeholder="Tên Đồ Án" />
                            <textarea
                                ref={projectRef}
                                className="cv-textarea"
                                value={currentProject?.projectDescription || ''}
                                onChange={(e) => updateProjectField(0, 'projectDescription', e.target.value)}
                                placeholder='Xây dựng một ứng dụng [Loại ứng dụng] bằng [Công nghệ chính A] và [Công nghệ chính B].\nĐịnh lượng kết quả: Dự án xử lý [X] bản ghi/giảm [Y]% thời gian xử lý.\nÁp dụng [Khái niệm kỹ thuật phức tạp: ví dụ: CI/CD, OOP, Microservices cơ bản].'
                            />
                        </div>
                    </section>
                );
            case 'EDUCATION':

                const currentEducation = cvData.education[0];
                // const time = currentEducation.startYear + " - " + currentEducation.endYear;

                return (
                    <section className="education">
                        <h2 style={headerStyle}>HỌC VẤN</h2>
                        <div className="education-entry flex flex-col gap-1.5">
                            <div className='flex items-center gap-2.5'>
                                <span><strong>Trường Đại Học:</strong></span>
                                <input type="text"
                                    className='input-cv-value flex-1'
                                    value={currentEducation.university}
                                    onChange={(e) => updateEducationField(0, 'university', e.target.value)}
                                    placeholder="Tên Trường Đại Học" />
                            </div>
                            <div className='flex items-center gap-2.5'>
                                <span><strong>Chuyên ngành:</strong></span>
                                <input type="text"
                                    className='input-cv-value flex-1'
                                    value={currentEducation.major}
                                    onChange={(e) => updateEducationField(0, 'major', e.target.value)}
                                    placeholder="Tên chuyên ngành" />
                            </div>
                            <div className="company-date flex items-center gap-2.5">
                                <span><strong>Thời gian:</strong></span>
                                <input type="text"
                                    className='input-cv-value flex-1'
                                    value={currentEducation.endYear}
                                    onChange={(e) => updateEducationField(0, 'endYear', e.target.value)}
                                    placeholder="Năm bắt đầu - Năm tốt nghiệp" />
                            </div>
                            <div className='flex items-center gap-2.5'>
                                <span><strong>GPA:</strong></span>
                                <input type="text"
                                    className='input-cv-value flex-1'
                                    value={currentEducation.gpa}
                                    onChange={(e) => updateEducationField(0, 'gpa', e.target.value)}
                                    placeholder="../4" />
                            </div>
                        </div>
                    </section>
                );
            case 'SKILLS':
                return (
                    <section className="skills">
                        <h2 style={headerStyle}>KỸ NĂNG CHUYÊN MÔN</h2>
                        <div className="skills-list flex flex-col gap-1.5">
                            <div className='flex items-center gap-1'>
                                <span><strong>Kỹ năng chuyên môn:</strong></span>
                                <div className='flex gap-1 flex-1 relative'>
                                    {profSkills.map((skill) => (
                                        <span className="tag" key={skill} style={{ backgroundColor: `${settings.color}` }}>
                                            {skill}{" "}
                                            <span className='tag-remove' onClick={() => handleRemoveProfSkill(skill)}>x</span>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        className='input-cv-value flex-1'
                                        value={profInput}
                                        onChange={handleProfInputChange}
                                        onFocus={handleProfFocus}
                                        onBlur={handleProfBlur}
                                        onKeyDown={handleProfKeyDown}
                                        placeholder="Thêm kỹ năng chuyên môn..."
                                    />
                                    {showProfSuggestion && filteredProfSkills.length > 0 && (
                                        <ul className="suggestion-list">
                                            {filteredProfSkills.map((skill) => (
                                                <li
                                                    key={skill}
                                                    onMouseDown={() => handleSelectProfSkill(skill)}
                                                >
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center gap-1'>
                                <span><strong>Kỹ năng mềm:</strong></span>
                                <div className='flex gap-1 flex-1 relative'>
                                    {softSkills.map((skill) => (
                                        <span className="tag" key={skill}>
                                            {skill}{" "}
                                            <span onClick={() => handleRemoveSoftSkill(skill)}>x</span>
                                        </span>
                                    ))}
                                    <input type="text"
                                        className='input-cv-value'
                                        value={softInput}
                                        onChange={handleSoftInputChange}
                                        onFocus={handleSoftFocus}
                                        onBlur={handleSoftBlur}
                                        onKeyDown={handleSoftKeyDown}
                                        placeholder="Thêm kỹ năng mềm..."
                                    />
                                    {showSoftSuggestion && filteredSoftSkills.length > 0 && (
                                        <ul className="suggestion-list">
                                            {filteredSoftSkills.map((skill) => (
                                                <li
                                                    key={skill}
                                                    onMouseDown={() => handleSelectSoftSkill(skill)}
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
                const activitiesRef = useRef<HTMLTextAreaElement>(null);

                useEffect(() => {
                    const element = activitiesRef.current;
                    if (element) {
                        element.style.height = '0px';
                        element.style.height = element.scrollHeight + 'px';
                    }
                }, [cvData.activitiesAwards]);

                return (
                    <section className="activities">
                        <h2 style={headerStyle}>KINH NGHIỆM KHÁC (HOẠT ĐỘNG & THÀNH TÍCH)</h2>
                        <textarea
                            ref={activitiesRef}
                            className="cv-textarea"
                            value={cvData.activitiesAwards}
                            onChange={(e) => updateCvData('activitiesAwards', e.target.value)}
                            // rows={5}
                            placeholder='* Thực tập ngắn hạn/Freelance: [Tên công ty/dự án] - [Nhiệm vụ chính]. (Nếu có bất kỳ kinh nghiệm nào dù ngắn).\n* Giải thưởng: [Tên giải thưởng] trong cuộc thi lập trình [Tên cuộc thi] năm [Năm].\n* Chứng chỉ: Chứng chỉ [Tên chứng chỉ] từ [Nguồn, ví dụ: Coursera, AWS].'
                        />
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <div className="cv-container" style={cvStyle} ref={ref}>
            {/* 1. HEADER & CONTACT (GIỮ CỐ ĐỊNH, KHÔNG KÉO THẢ) */}
            <header className="cv-header">
                <input className='cv-header-inputname input-cv-value'
                    style={h1BorderStyle}
                    value={cvData.name}
                    onChange={(e) => updateCvData('name', e.target.value)}
                    placeholder="HỌ VÀ TÊN"
                />
                <input className="title input-cv-value"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="VỊ TRÍ ỨNG TUYỂN (Fresher / Intern / Apprentice)"
                />
            </header>

            <section className="contact-info flex gap-3 flex-wrap">
                {/* EMAIL */}
                {showEmail && (
                    <div className='flex items-center contact-info_item'><strong>Email:</strong>
                        <input className='input-cv-value'
                            type="text"
                            // ĐỌC TỪ PROPS
                            value={cvData.contact.email}
                            // GỌI HANDLER MỚI
                            onChange={(e) => updateContactField('email', e.target.value)}
                            placeholder="email@example.com" />
                        <button className='cv-editor-control cv-del-control' onClick={() => setShowEmail(false)}>Ẩn</button>
                    </div>
                )}
                {!showEmail && <button className='cv-editor-control cv-add-control' onClick={() => setShowEmail(true)}>+ Email</button>}

                {/* SỐ ĐIỆN THOẠI (PHONE) */}
                {showPhone && (
                    <div className='flex items-center contact-info_item'><strong>Số điện thoại:</strong>
                        <input className='input-cv-value'
                            type="text"
                            // ĐỌC TỪ PROPS
                            value={cvData.contact.phone}
                            // GỌI HANDLER MỚI
                            onChange={(e) => updateContactField('phone', e.target.value)}
                            placeholder="(84) [Số điện thoại]" />
                        <button className='cv-editor-control cv-del-control' onClick={() => setShowPhone(false)}>Ẩn</button>
                    </div>
                )}
                {!showPhone && <button className='cv-editor-control cv-add-control' onClick={() => setShowPhone(true)}>+ SĐT</button>}

                {/* LINKEDIN */}
                {showLinkedln && (
                    <div className='flex items-center contact-info_item'><strong>LinkedIn:</strong>
                        <input className='input-cv-value'
                            type="text"
                            // ĐỌC TỪ PROPS
                            value={cvData.contact.website} // Giả định bạn dùng 'website' cho LinkedIn nếu không có trường riêng
                            // GỌI HANDLER MỚI
                            onChange={(e) => updateContactField('website', e.target.value)}
                            placeholder="linkedin.com/in/..." />
                        <button className='cv-editor-control cv-del-control' onClick={() => setShowLinkedln(false)}>Ẩn</button>
                    </div>
                )}
                {!showLinkedln && <button className='cv-editor-control cv-add-control' onClick={() => setShowLinkedln(true)}>+ Linkedln</button>}

                {/* GITHUB */}
                {showGithub && (
                    <div className='flex items-center contact-info_item'><strong>GitHub/Portfolio:</strong>
                        <input className='input-cv-value'
                            type="text"
                            // ĐỌC TỪ PROPS
                            value={cvData.contact.github}
                            // GỌI HANDLER MỚI
                            onChange={(e) => updateContactField('github', e.target.value)}
                            placeholder="github.com/..." />
                        <button className='cv-editor-control cv-del-control' onClick={() => setShowGithub(false)}>Ẩn</button>
                    </div>
                )}
                {!showGithub && <button className='cv-editor-control cv-add-control' onClick={() => setShowGithub(true)}>+ GitHub</button>}
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
                    >
                        {/* TOOLBAR ĐIỀU KHIỂN */}
                        <div className="cv-section-controls">
                            {section.isRemovable && <span className="drag-handle" style={{ cursor: 'grab' }}>:: KÉO ::</span>}

                            {section.isRemovable && (
                                <button
                                    className='cv-editor-control cv-del-control'
                                    onClick={() => handleRemoveSection(section.id)}
                                    title={`Ẩn mục ${section.title}`}
                                >
                                    Xóa/Ẩn
                                </button>
                            )}
                        </div>

                        {/* NỘI DUNG SECTION */}
                        {renderSectionComponent(section.componentKey)}
                    </div>
                ) : null
            ))}

            {/* 3. KHU VỰC THÊM MỤC (Các mục đã bị ẩn) */}
            <div className="add-section-ui flex gap-2 flex-wrap p-2 border-t mt-4">
                <strong>Thêm các mục đã ẩn:</strong>
                {defaultCvSections.filter(s => !cvSections.find(cs => cs.id === s.id && cs.isVisible))
                    .map(hiddenSection => (
                        <button
                            key={hiddenSection.id}
                            className='cv-editor-control cv-add-control'
                            onClick={() => handleAddSection(hiddenSection.id)}
                        >
                            + Thêm {hiddenSection.title}
                        </button>
                    ))}
            </div>

        </div>
    );
}
);

export default FreshInternCVTemplate;