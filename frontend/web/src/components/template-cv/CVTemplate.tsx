import { forwardRef} from 'react';
import './cvtemplate.css';
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
  year: string;
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

interface CVTemplateProps {
  cvData: CVData;
  currentLanguage: 'vi' | 'en';
}

const CVTemplate = forwardRef<HTMLDivElement, CVTemplateProps>((props, ref) => {
  const { cvData, currentLanguage } = props;

  return (
    <div className="cv-template" ref={ref}>
      <h2>{cvData.name || (currentLanguage === 'vi' ? "Họ và Tên" : "Full Name")}</h2>
      {/* <div className="section">{currentLanguage === 'vi' ? "Thông Tin Cá Nhân" : "Personal Information"}</div> */}
      <div className="template-info">
        <p><strong>{currentLanguage === 'vi' ? "Số điện thoại:" : "Phone:"}</strong> {cvData.contact.phone || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
        <p><strong>Email:</strong> {cvData.contact.email || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
        <p><strong>Github:</strong> {cvData.contact.github || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
        <p><strong>Website:</strong> {cvData.contact.website || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
      </div>
      <div className="section">{currentLanguage === 'vi' ? "Giới Thiệu & Mục Tiêu Nghề Nghiệp" : "Introduction & Career Objective"}</div>
      <div className="template-info">
        <p>{cvData.introduction || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
      </div>
      <div className="section">{currentLanguage === 'vi' ? "Kỹ Năng" : "Skills"}</div>
      <div className="subsection-content">
        <p><strong>{currentLanguage === 'vi' ? "Kỹ Năng Chuyên Môn:" : "Professional Skills:"}</strong> {cvData.professionalSkills || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
        <p><strong>{currentLanguage === 'vi' ? "Kỹ Năng Mềm:" : "Soft Skills:"}</strong> {cvData.softSkills || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
      </div>
      <div className="section">{currentLanguage === 'vi' ? "Học Vấn" : "Education"}</div>
      {cvData.education.map((edu, index) => (
        <div key={index} className="subsection-content">
          <p><strong>{currentLanguage === 'vi' ? "Trường:" : "University:"}</strong> {edu.university || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
          <p><strong>{currentLanguage === 'vi' ? "Chuyên ngành:" : "Major:"}</strong> {edu.major || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
          <p><strong>GPA:</strong> {edu.gpa || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
          <p><strong>{currentLanguage === 'vi' ? "Thời gian:" : "Year:"}</strong> {edu.year || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
        </div>
      ))}
      <div className="section">{currentLanguage === 'vi' ? "Kinh Nghiệm" : "Experience"}</div>
      <div className="subsection-content">
        <p>{cvData.experience || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
      </div>
      <div className="section">{currentLanguage === 'vi' ? "Dự Án" : "Projects"}</div>
      {cvData.projects.map((project, index) => (
        <div key={index} className="subsection-content">
          <p><strong>{currentLanguage === 'vi' ? "Tên dự án:" : "Project Name:"}</strong> {project.projectName || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
          <p><strong>{currentLanguage === 'vi' ? "Mô tả:" : "Description:"}</strong> {project.projectDescription || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
        </div>
      ))}
      <div className="section">{currentLanguage === 'vi' ? "Chứng Chỉ" : "Certifications"}</div>
      <div className="subsection-content">
        <p>{cvData.certifications || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
      </div>
      <div className="section">{currentLanguage === 'vi' ? "Hoạt Động / Giải Thưởng" : "Activities / Awards"}</div>
      <div className="subsection-content">
        <p>{cvData.activitiesAwards || (currentLanguage === 'vi' ? "Chưa có thông tin" : "No information yet")}</p>
      </div>
    </div>
  );
});

export default CVTemplate;