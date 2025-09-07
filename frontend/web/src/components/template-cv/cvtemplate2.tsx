import { forwardRef } from "react";
import "./cvtemplate2.css";

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
  currentLanguage: "vi" | "en";
}

const CVTemplate2 = forwardRef<HTMLDivElement, CVTemplateProps>(
  ({ cvData, currentLanguage }, ref) => {
    return (
      <div className="cv2-container" ref={ref}>
        <div className="cv2-header">
          <h1>{cvData.name || (currentLanguage === "vi" ? "Họ và Tên" : "Full Name")}</h1>
          <p className="cv2-intro">{cvData.introduction || (currentLanguage === "vi" ? "Chưa có thông tin" : "No information yet")}</p>
        </div>

        <div className="cv2-body">
          {/* LEFT COLUMN */}
          <div className="cv2-left">
            <div className="cv2-section">
              <h3>{currentLanguage === "vi" ? "Thông Tin Cá Nhân" : "Contact Info"}</h3>
              <p><strong>Phone:</strong> {cvData.contact.phone || "–"}</p>
              <p><strong>Email:</strong> {cvData.contact.email || "–"}</p>
              <p><strong>Github:</strong> {cvData.contact.github || "–"}</p>
              <p><strong>Website:</strong> {cvData.contact.website || "–"}</p>
            </div>

            <div className="cv2-section">
              <h3>{currentLanguage === "vi" ? "Kỹ Năng" : "Skills"}</h3>
              <p><strong>{currentLanguage === "vi" ? "Chuyên môn:" : "Professional:"}</strong> {cvData.professionalSkills || "–"}</p>
              <p><strong>{currentLanguage === "vi" ? "Mềm:" : "Soft:"}</strong> {cvData.softSkills || "–"}</p>
            </div>

            <div className="cv2-section">
              <h3>{currentLanguage === "vi" ? "Chứng Chỉ" : "Certifications"}</h3>
              <p>{cvData.certifications || "–"}</p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="cv2-right">
            <div className="cv2-section">
              <h3>{currentLanguage === "vi" ? "Học Vấn" : "Education"}</h3>
              {cvData.education.map((edu, i) => (
                <div key={i} className="cv2-subsection">
                  <p><strong>{edu.university}</strong> ({edu.year})</p>
                  <p>{edu.major} | GPA: {edu.gpa}</p>
                </div>
              ))}
            </div>

            <div className="cv2-section">
              <h3>{currentLanguage === "vi" ? "Kinh Nghiệm" : "Experience"}</h3>
              <p>{cvData.experience || "–"}</p>
            </div>

            <div className="cv2-section">
              <h3>{currentLanguage === "vi" ? "Dự Án" : "Projects"}</h3>
              {cvData.projects.map((proj, i) => (
                <div key={i} className="cv2-subsection">
                  <p><strong>{proj.projectName}</strong></p>
                  <p>{proj.projectDescription}</p>
                </div>
              ))}
            </div>

            <div className="cv2-section">
              <h3>{currentLanguage === "vi" ? "Hoạt Động / Giải Thưởng" : "Activities / Awards"}</h3>
              <p>{cvData.activitiesAwards || "–"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default CVTemplate2;
