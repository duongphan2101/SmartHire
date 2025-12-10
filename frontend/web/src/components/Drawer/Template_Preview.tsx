import { forwardRef } from 'react';
import '../Templates/Template-1/SeniorCVTemplate.css';
import { BsFillGeoFill, BsFillTelephoneFill, BsLink45Deg, BsThreads } from "react-icons/bs";

// ... (Giữ nguyên các Interface phụ như CustomSettings, Experience, ContactInfo...)
interface CustomSettings {
    color?: string;
    fontFamily?: string;
    lang?: string;
}

interface Experience {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
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
    templateType?: number;
    color?: string;
    fontFamily?: string;
    languageForCV?: string;
}

// [CẬP NHẬT] Thêm color và language vào Props
interface FreshInternCVPreviewProps {
    cvData: CVData;
    settings?: CustomSettings;
    color?: string;    // Biến color truyền từ ngoài vào (ưu tiên cao nhất)
    language?: string; // Biến language truyền từ ngoài vào ('vi' | 'en')
}

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
            AT: 'tại',
            UNIVERSITY: 'Trường Đại Học:',
            MAJOR: 'Chuyên ngành:',
            TIME: 'Thời gian:',
            PROFESSIONAL_SKILLS: 'Chuyên môn:',
            SOFT_SKILLS: 'Kỹ năng mềm:',
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
            AT: 'at',
            UNIVERSITY: 'University:',
            MAJOR: 'Major:',
            TIME: 'Time:',
            PROFESSIONAL_SKILLS: 'Professional Skills:',
            SOFT_SKILLS: 'Soft Skills:',
        }
    }
};

// [CẬP NHẬT] Destructure color và language
const FreshInternCVPreview = forwardRef<HTMLDivElement, FreshInternCVPreviewProps>(({ cvData, settings, color, language }, ref) => {
    
    // 1. XỬ LÝ NGÔN NGỮ (Ưu tiên props language > settings > data)
    const rawLang = language || settings?.lang || cvData.languageForCV || 'vi';
    const lang = rawLang === 'en' ? 'en' : 'vi';
    const T = translations[lang];

    // Hàm xử lý màu an toàn
    const sanitizeColor = (c: string | undefined): string => {
        if (!c) return '#059669';
        // Kiểm tra mã Hex hợp lệ
        if (/^#([0-9A-F]{3}){1,2}$/i.test(c)) return c;
        // Nếu là màu dạng oklch/lch (thường từ tailwind mới) thì fallback về màu mặc định để tránh lỗi style inline cũ
        if (c.includes('oklch') || c.includes('lch')) return '#059669';
        return c;
    };

    // 2. XỬ LÝ MÀU SẮC (Ưu tiên props color > settings > data)
    const rawColor = color || settings?.color || cvData.color;
    const safeColor = sanitizeColor(rawColor);

    const rawFont = settings?.fontFamily || cvData.fontFamily || 'Arial';

    const cvStyle = { fontFamily: rawFont };
    const headerStyle = { color: safeColor, fontFamily: rawFont, fontWeight: 'bold' };
    const h1BorderStyle = { color: safeColor, fontFamily: rawFont };

    // ... (Các hàm helper giữ nguyên)
    const hasValue = (val: string | undefined | null) => !!(val && val.trim().length > 0);

    const skillsArray = (skillsString: string): string[] => {
        try {
            return skillsString ? JSON.parse(skillsString) : [];
        } catch {
            return skillsString ? skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
        }
    };

    const currentProfSkills = skillsArray(cvData.professionalSkills);
    const currentSoftSkills = skillsArray(cvData.softSkills);

    const renderProjectEntry = (project: Project, index: number) => (
        <div key={index} className="job-entry border-l-4 relative group mb-4" style={{ borderColor: '#e5e7eb' }}> 
             {/* Lưu ý: border-left ở đây đang dùng màu xám mặc định class css, 
                 nếu muốn border màu theo theme thì sửa style={{ borderColor: safeColor }} */}
            <div className="project-title font-bold text-left mb-1" style={{ fontFamily: rawFont }}>
                {project.projectName}
            </div>
            <p className="whitespace-pre-wrap text-justify" style={{ fontFamily: rawFont }}>
                {project.projectDescription}
            </p>
        </div>
    );

    const renderEducationEntry = (edu: Education, index: number) => (
        <div key={index} className="education-entry flex flex-col gap-1.5 mb-3">
            <div className='flex items-center gap-2.5'>
                <span><strong style={{ fontFamily: rawFont }}>{T.PHRASES.UNIVERSITY}</strong></span>
                <span style={{ fontFamily: rawFont }}>{edu.university}</span>
            </div>
            <div className='flex items-center gap-2.5'>
                <span><strong style={{ fontFamily: rawFont }}>{T.PHRASES.MAJOR}</strong></span>
                <span style={{ fontFamily: rawFont }}>{edu.major}</span>
            </div>
            <div className="company-date flex items-center gap-2.5">
                <span><strong style={{ fontFamily: rawFont }}>{T.PHRASES.TIME}</strong></span>
                <span style={{ fontFamily: rawFont }}>
                    {edu.startYear} - {edu.endYear}
                </span>
            </div>
            {edu.gpa && (
                <div className='flex items-center gap-2.5'>
                    <span><strong style={{ fontFamily: rawFont }}>GPA:</strong></span>
                    <span style={{ fontFamily: rawFont }}>{edu.gpa}/4</span>
                </div>
            )}
        </div>
    );

    const renderExperienceEntry = (exp: Experience, index: number) => (
        <div key={index} className="job-entry border-l-4 relative group mb-4" style={{ borderColor: '#e5e7eb' }}>
            <div className='flex items-center gap-2.5 mb-1'>
                <span className="font-bold" style={{ fontFamily: rawFont }}>{exp.jobTitle}</span>
                <span style={{ fontFamily: rawFont }}>{T.PHRASES.AT}</span>
                <span className="italic" style={{ fontFamily: rawFont }}>{exp.company}</span>
            </div>
            <div className="company-date flex items-center gap-2.5 text-sm italic mb-2 text-gray-600">
                <span style={{ fontFamily: rawFont }}>
                    {exp.startDate} - {exp.endDate}
                </span>
            </div>
            <p className="whitespace-pre-wrap text-justify" style={{ fontFamily: rawFont }}>
                {exp.description}
            </p>
        </div>
    );

    return (
        <div className="cv-container preview-mode" style={{ ...cvStyle, padding: '20px', backgroundColor: '#fff' }} ref={ref}>
            {/* HEADER */}
            <header className="cv-header text-center mb-6">
                <h1 className='uppercase font-bold text-2xl' style={h1BorderStyle}>
                    {cvData.name}
                </h1>

                <hr style={{ border: 'none', height: '2px', backgroundColor: safeColor, marginTop: '10px', marginBottom: '8px' }} />

                <h2 className="text-xl" style={h1BorderStyle}>
                    {cvData.title}
                </h2>
            </header>

            {/* CONTACT INFO */}
            <section className="contact-info flex gap-5 flex-wrap justify-center mb-6 text-sm">
                {hasValue(cvData.contact?.email) && (
                    <div className='flex items-center gap-1'>
                        <BsThreads color={safeColor} />
                        <span>{cvData.contact.email}</span>
                    </div>
                )}
                {hasValue(cvData.contact?.phone) && (
                    <div className='flex items-center gap-1'>
                        <BsFillTelephoneFill color={safeColor} />
                        <span>{cvData.contact.phone}</span>
                    </div>
                )}
                {hasValue(cvData.contact?.address) && (
                    <div className='flex items-center gap-1'>
                        <BsFillGeoFill color={safeColor} />
                        <span>{cvData.contact.address}</span>
                    </div>
                )}
                {hasValue(cvData.contact?.website) && (
                    <div className='flex items-center gap-1'>
                        <BsLink45Deg color={safeColor} />
                        <a href={`https://${cvData.contact.website}`} target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>{cvData.contact.website}</a>
                    </div>
                )}
                {hasValue(cvData.contact?.github) && (
                    <div className='flex items-center gap-0.5'>
                        <BsLink45Deg color={safeColor} />
                        <a href={`https://${cvData.contact.github}`} target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>{cvData.contact.github}</a>
                    </div>
                )}
            </section>

            {/* MAIN SECTIONS */}
            
            {/* 1. SUMMARY */}
            {hasValue(cvData.introduction) && (
                <section className="summary mb-6">
                    <h2 className="mb-3 pb-1" style={{ ...headerStyle, borderColor: safeColor }}>{T.SECTIONS.SUMMARY.toUpperCase()}</h2>
                    <p className="whitespace-pre-wrap text-justify" style={{ fontFamily: rawFont }}>
                        {cvData.introduction}
                    </p>
                </section>
            )}

            {/* 2. EXPERIENCE */}
            {cvData.experience && cvData.experience.length > 0 && (
                <section className="experience mb-6">
                    <h2 className="mb-3 pb-1" style={{ ...headerStyle, borderColor: safeColor }}>{T.SECTIONS.EXPERIENCE.toUpperCase()}</h2>
                    {cvData.experience.map(renderExperienceEntry)}
                </section>
            )}

            {/* 3. PROJECTS */}
            {cvData.projects && cvData.projects.length > 0 && (
                <section className="projects mb-6">
                    <h2 className="mb-3 pb-1" style={{ ...headerStyle, borderColor: safeColor }}>{T.SECTIONS.PROJECTS.toUpperCase()}</h2>
                    {cvData.projects.map(renderProjectEntry)}
                </section>
            )}

            {/* 4. EDUCATION */}
            {cvData.education && cvData.education.length > 0 && (
                <section className="education mb-6">
                    <h2 className="mb-3 pb-1" style={{ ...headerStyle, borderColor: safeColor }}>{T.SECTIONS.EDUCATION.toUpperCase()}</h2>
                    {cvData.education.map(renderEducationEntry)}
                </section>
            )}

            {/* 5. SKILLS */}
            {(currentProfSkills.length > 0 || currentSoftSkills.length > 0) && (
                <section className="skills mb-6">
                    <h2 className="mb-3 pb-1" style={{ ...headerStyle, borderColor: safeColor }}>{T.SECTIONS.SKILLS.toUpperCase()}</h2>
                    <div className="skills-list flex flex-col gap-2.5">
                        {currentProfSkills.length > 0 && (
                            <div className='flex items-baseline gap-1 skill-line'>
                                <span><strong style={{ fontFamily: rawFont }}>{T.PHRASES.PROFESSIONAL_SKILLS}</strong></span>
                                <div className='flex gap-2 flex-wrap flex-1'>
                                    {currentProfSkills.map((skill) => (
                                        <span className="tag font-bold" key={skill} style={{ color: '#000', fontWeight: 'normal', fontFamily: rawFont, borderBottom: `2px solid ${safeColor}` }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {currentSoftSkills.length > 0 && (
                            <div className='flex items-baseline gap-1 skill-line'>
                                <span><strong style={{ fontFamily: rawFont }}>{T.PHRASES.SOFT_SKILLS}</strong></span>
                                <div className='flex gap-2 flex-wrap flex-1'>
                                    {currentSoftSkills.map((skill) => (
                                        <span className="tag font-bold" key={skill} style={{ color: '#000', fontWeight: 'normal', fontFamily: rawFont, borderBottom: `2px solid ${safeColor}` }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* 6. ACTIVITIES & AWARDS */}
            {hasValue(cvData.activitiesAwards) && (
                <section className="activities mb-6">
                    <h2 className="mb-3 pb-1" style={{ ...headerStyle, borderColor: safeColor }}>{T.SECTIONS.ACTIVITIES.toUpperCase()}</h2>
                    <p className="whitespace-pre-wrap text-justify" style={{ fontFamily: rawFont }}>
                        {cvData.activitiesAwards}
                    </p>
                </section>
            )}
        </div>
    );
});

export default FreshInternCVPreview;