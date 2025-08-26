import React, { useState } from "react";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";
import "./BuildCV.css";

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

const BuildCV: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>({
    name: "",
    introduction: "",
    professionalSkills: "",
    softSkills: "",
    experience: "",
    certifications: "",
    activitiesAwards: "",
    contact: { phone: "", email: "", github: "", website: "" },
    education: [{ university: "", major: "", gpa: "", year: "" }],
    projects: [{ projectName: "", projectDescription: "" }],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCvData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCvData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  
  const handleEducationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newEducation = cvData.education.map((edu, i) =>
      i === index ? { ...edu, [name]: value } : edu
    );
    setCvData((prev) => ({ ...prev, education: newEducation }));
  };

  const handleAddEducation = () => {
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, { university: "", major: "", gpa: "", year: "" }],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = cvData.education.filter((_, i) => i !== index);
    setCvData((prev) => ({ ...prev, education: newEducation }));
  };

 
  const handleProjectChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newProjects = cvData.projects.map((project, i) =>
      i === index ? { ...project, [name]: value } : project
    );
    setCvData((prev) => ({ ...prev, projects: newProjects }));
  };

  const handleAddProject = () => {
    setCvData((prev) => ({
      ...prev,
      projects: [...prev.projects, { projectName: "", projectDescription: "" }],
    }));
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = cvData.projects.filter((_, i) => i !== index);
    setCvData((prev) => ({ ...prev, projects: newProjects }));
  };

  const handleCreateCV = () => {
    alert("CV đã được tạo! (Chức năng tải xuống có thể được thêm vào.)");
  };

  return (
    <div className="App">
      <Header />
      <div className="cv-builder">

        <div className="cv-template">
          <h2>{cvData.name || "Họ và Tên"}</h2>
          
          <div className="section">Thông Tin Cá Nhân</div>
          <div className="template-info">
            <p><strong>Số điện thoại:</strong> {cvData.contact.phone || "Chưa có thông tin"}</p>
            <p><strong>Email:</strong> {cvData.contact.email || "Chưa có thông tin"}</p>
            <p><strong>Github:</strong> {cvData.contact.github || "Chưa có thông tin"}</p>
            <p><strong>Website:</strong> {cvData.contact.website || "Chưa có thông tin"}</p>
          </div>
          
          <div className="section">Giới Thiệu & Mục Tiêu Nghề Nghiệp</div>
          <div className="template-info">{cvData.introduction || "Chưa có thông tin"}</div>
          
          <div className="section">Kỹ Năng</div>
          <div className="subsection-content">
            <p><strong>Kỹ Năng Chuyên Môn:</strong> {cvData.professionalSkills || "Chưa có thông tin"}</p>
            <p><strong>Kỹ Năng Mềm:</strong> {cvData.softSkills || "Chưa có thông tin"}</p>
          </div>

          <div className="section">Học Vấn</div>
          {cvData.education.map((edu, index) => (
            <div key={index} className="subsection-content">
              <p><strong>Trường:</strong> {edu.university || "Chưa có thông tin"}</p>
              <p><strong>Chuyên ngành:</strong> {edu.major || "Chưa có thông tin"}</p>
              <p><strong>GPA:</strong> {edu.gpa || "Chưa có thông tin"}</p>
              <p><strong>Thời gian:</strong> {edu.year || "Chưa có thông tin"}</p>
            </div>
          ))}

          <div className="section">Kinh Nghiệm</div>
          <div className="subsection-content">{cvData.experience || "Chưa có thông tin"}</div>

          <div className="section">Dự Án</div>
          {cvData.projects.map((project, index) => (
            <div key={index} className="subsection-content">
              <p><strong>Tên dự án:</strong> {project.projectName || "Chưa có thông tin"}</p>
              <p><strong>Mô tả:</strong> {project.projectDescription || "Chưa có thông tin"}</p>
            </div>
          ))}

          <div className="section">Chứng Chỉ</div>
          <div className="subsection-content">{cvData.certifications || "Chưa có thông tin"}</div>

          <div className="section">Hoạt Động / Giải Thưởng</div>
          <div className="subsection-content">{cvData.activitiesAwards || "Chưa có thông tin"}</div>
          
          <div className="cv-controls">
            <button onClick={handleCreateCV}>Tạo CV</button>
            <button style={{background:"#484747ff"}}>Tiếng Anh</button>
            <button style={{background:"#484747ff"}}>Tiếng Việt</button>
          </div>
        </div>

        <div className="cv-input">
          <h3 className="section-title">Thông Tin Cá Nhân</h3>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="name">Họ Tên</label>
              <input type="text" name="name" value={cvData.name} onChange={handleChange} id="name" placeholder="Nguyễn Văn A" />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input type="tel" name="phone" value={cvData.contact.phone} onChange={handleContactChange} id="phone" placeholder="0987654321" />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={cvData.contact.email} onChange={handleContactChange} id="email" placeholder="nguyenvana@example.com" />
            </div>
            <div className="input-group">
              <label htmlFor="github">Github</label>
              <input type="url" name="github" value={cvData.contact.github} onChange={handleContactChange} id="github" placeholder="https://github.com/nguyenvana" />
            </div>
            <div className="input-group">
              <label htmlFor="website">Website</label>
              <input type="url" name="website" value={cvData.contact.website} onChange={handleContactChange} id="website" placeholder="https://nguyenvana.dev" />
            </div>
          </div>

          <h3 className="section-title">Giới Thiệu & Mục Tiêu Nghề Nghiệp</h3>
          <div className="input-group-full-width">
            <label htmlFor="introduction">Giới thiệu & Mục tiêu nghề nghiệp</label>
            <textarea name="introduction" value={cvData.introduction} onChange={handleChange} id="introduction" rows={4} placeholder="Sinh viên năm cuối ngành Kỹ thuật phần mềm, có kiến thức về Java, Spring Boot, React..." />
          </div>

          <h3 className="section-title">Kỹ Năng</h3>
          <div className="input-group-full-width">
            <label htmlFor="professionalSkills">Kỹ năng chuyên môn</label>
            <input type="text" name="professionalSkills" value={cvData.professionalSkills} onChange={handleChange} id="professionalSkills" placeholder="Java, Spring Boot, React, MongoDB" />
          </div>
          <div className="input-group-full-width">
            <label htmlFor="softSkills">Kỹ năng mềm</label>
            <input type="text" name="softSkills" value={cvData.softSkills} onChange={handleChange} id="softSkills" placeholder="Làm việc nhóm, Giải quyết vấn đề" />
          </div>
          
          <h3 className="section-title">Học Vấn</h3>
          {cvData.education.map((edu, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group">
                <label htmlFor={`university-${index}`}>Trường đại học</label>
                <input type="text" name="university" value={edu.university} onChange={(e) => handleEducationChange(index, e)} id={`university-${index}`} placeholder="Đại học Công nghệ thông tin" />
              </div>
              <div className="input-group">
                <label htmlFor={`major-${index}`}>Chuyên ngành</label>
                <input type="text" name="major" value={edu.major} onChange={(e) => handleEducationChange(index, e)} id={`major-${index}`} placeholder="Kỹ thuật phần mềm" />
              </div>
              <div className="input-group">
                <label htmlFor={`gpa-${index}`}>GPA (../4)</label>
                <input type="text" name="gpa" value={edu.gpa} onChange={(e) => handleEducationChange(index, e)} id={`gpa-${index}`} placeholder="3.8" />
              </div>
              <div className="input-group">
                <label htmlFor={`year-${index}`}>Thời gian học</label>
                <input type="text" name="year" value={edu.year} onChange={(e) => handleEducationChange(index, e)} id={`year-${index}`} placeholder="2021 - 2025" />
              </div>
              {cvData.education.length > 1 && (
                <button type="button" onClick={() => handleRemoveEducation(index)} className="remove-btn">Xóa</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddEducation} className="add-btn">Thêm Học Vấn</button>

          <h3 className="section-title">Kinh Nghiệm</h3>
          <div className="input-group-full-width">
            <label htmlFor="experience">Kinh nghiệm làm việc</label>
            <textarea name="experience" value={cvData.experience} onChange={handleChange} id="experience" rows={4} placeholder="Ví dụ: Công ty ABC (2023 - Nay), Vị trí: Lập trình viên Backend..." />
          </div>

          <h3 className="section-title">Dự Án</h3>
          {cvData.projects.map((project, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group-full-width">
                <label htmlFor={`projectName-${index}`}>Tên dự án</label>
                <input type="text" name="projectName" value={project.projectName} onChange={(e) => handleProjectChange(index, e)} id={`projectName-${index}`} placeholder="Ví dụ: Ứng dụng quản lý sinh viên" />
              </div>
              <div className="input-group-full-width">
                <label htmlFor={`projectDescription-${index}`}>Mô tả dự án</label>
                <textarea name="projectDescription" value={project.projectDescription} onChange={(e) => handleProjectChange(index, e)} id={`projectDescription-${index}`} rows={3} placeholder="Mô tả công nghệ sử dụng, chức năng chính và vai trò của bạn." />
              </div>
              {cvData.projects.length > 1 && (
                <button type="button" onClick={() => handleRemoveProject(index)} className="remove-btn">Xóa</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddProject} className="add-btn">Thêm Dự Án</button>

          <h3 className="section-title">Chứng Chỉ và Giải Thưởng</h3>
          <div className="input-group-full-width">
            <label htmlFor="certifications">Chứng chỉ</label>
            <textarea name="certifications" value={cvData.certifications} onChange={handleChange} id="certifications" rows={4} placeholder="Ví dụ: Chứng chỉ AWS Cloud Practitioner, TOEIC 900" />
          </div>
          <div className="input-group-full-width">
            <label htmlFor="activitiesAwards">Hoạt động / Giải thưởng</label>
            <textarea name="activitiesAwards" value={cvData.activitiesAwards} onChange={handleChange} id="activitiesAwards" rows={4} placeholder="Ví dụ: Thành viên CLB Tin học, Giải ba cuộc thi lập trình" />
          </div>
        </div>

      </div>
      <ChatWithAI />
      <Footer />
    </div>
  );
};

export default BuildCV;