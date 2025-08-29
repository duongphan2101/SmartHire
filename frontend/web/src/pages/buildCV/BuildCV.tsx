import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

  const cvTemplateRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCvData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      education: [
        ...prev.education,
        { university: "", major: "", gpa: "", year: "" },
      ],
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

  const handleCreateCV = async () => {
    const element = cvTemplateRef.current;
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft >= 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save("cv-nguyenvana.pdf");
        alert("CV đã được tạo và tải xuống thành công!");
      } catch (error) {
        console.error("Lỗi khi tạo PDF:", error);
        alert("Đã xảy ra lỗi khi tạo CV. Vui lòng thử lại.");
      }
    } else {
      alert("Không tìm thấy nội dung CV để tạo PDF.");
    }
  };

  return (
    <div className="App">
      <Header />

      <div className="cv-builder">
        {/* Đặt ref vào div mà bạn muốn xuất ra PDF */}
        <div className="cv-template" ref={cvTemplateRef}>
          <h2>{cvData.name || "Họ và Tên"}</h2>

          <div className="section">Thông Tin Cá Nhân</div>
          <div className="template-info">
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {cvData.contact.phone || "Chưa có thông tin"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {cvData.contact.email || "Chưa có thông tin"}
            </p>
            <p>
              <strong>Github:</strong>{" "}
              {cvData.contact.github || "Chưa có thông tin"}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              {cvData.contact.website || "Chưa có thông tin"}
            </p>
          </div>

          <div className="section">Giới Thiệu & Mục Tiêu Nghề Nghiệp</div>
          <div className="template-info">
            {cvData.introduction || "Chưa có thông tin"}
          </div>

          <div className="section">Kỹ Năng</div>
          <div className="subsection-content">
            <p>
              <strong>Kỹ Năng Chuyên Môn:</strong>{" "}
              {cvData.professionalSkills || "Chưa có thông tin"}
            </p>
            <p>
              <strong>Kỹ Năng Mềm:</strong>{" "}
              {cvData.softSkills || "Chưa có thông tin"}
            </p>
          </div>

          <div className="section">Học Vấn</div>
          {cvData.education.map((edu, index) => (
            <div key={index} className="subsection-content">
              <p>
                <strong>Trường:</strong> {edu.university || "Chưa có thông tin"}
              </p>
              <p>
                <strong>Chuyên ngành:</strong>{" "}
                {edu.major || "Chưa có thông tin"}
              </p>
              <p>
                <strong>GPA:</strong> {edu.gpa || "Chưa có thông tin"}
              </p>
              <p>
                <strong>Thời gian:</strong> {edu.year || "Chưa có thông tin"}
              </p>
            </div>
          ))}

          <div className="section">Kinh Nghiệm</div>
          <div className="subsection-content">
            {cvData.experience || "Chưa có thông tin"}
          </div>

          <div className="section">Dự Án</div>
          {cvData.projects.map((project, index) => (
            <div key={index} className="subsection-content">
              <p>
                <strong>Tên dự án:</strong>{" "}
                {project.projectName || "Chưa có thông tin"}
              </p>
              <p>
                <strong>Mô tả:</strong>{" "}
                {project.projectDescription || "Chưa có thông tin"}
              </p>
            </div>
          ))}

          <div className="section">Chứng Chỉ</div>
          <div className="subsection-content">
            {cvData.certifications || "Chưa có thông tin"}
          </div>

          <div className="section">Hoạt Động / Giải Thưởng</div>
          <div className="subsection-content">
            {cvData.activitiesAwards || "Chưa có thông tin"}
          </div>
        </div>

        <div className="cv-input">
          <h3 className="section-title">Thông Tin Cá Nhân</h3>
          <div className="input-row">
            <div className="input-group">
              <div className="input-container">
                <input
                  required={true}
                  id="name"
                  type="text"
                  name="name"
                  value={cvData.name}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label className="label" htmlFor="name">
                  Họ Tên
                </label>
                <div className="underline"></div>
              </div>
            </div>
            <div className="input-group">
              <div className="input-container">
                <input
                  required={true}
                  id="phone"
                  type="tel"
                  name="phone"
                  value={cvData.contact.phone}
                  onChange={handleContactChange}
                  placeholder=" "
                />
                <label className="label" htmlFor="phone">
                  Số điện thoại
                </label>
                <div className="underline"></div>
              </div>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <div className="input-container">
                <input
                  required={true}
                  id="email"
                  type="email"
                  name="email"
                  value={cvData.contact.email}
                  onChange={handleContactChange}
                  placeholder=" "
                />
                <label className="label" htmlFor="email">
                  Email
                </label>
                <div className="underline"></div>
              </div>
            </div>
            <div className="input-group">
              <div className="input-container">
                <input
                  required={true}
                  id="github"
                  type="url"
                  name="github"
                  value={cvData.contact.github}
                  onChange={handleContactChange}
                  placeholder=" "
                />
                <label className="label" htmlFor="github">
                  Github
                </label>
                <div className="underline"></div>
              </div>
            </div>
            <div className="input-group">
              <div className="input-container">
                <input
                  required={true}
                  id="website"
                  type="url"
                  name="website"
                  value={cvData.contact.website}
                  onChange={handleContactChange}
                  placeholder=" "
                />
                <label className="label" htmlFor="website">
                  Website
                </label>
                <div className="underline"></div>
              </div>
            </div>
          </div>

          <h3 className="section-title">Giới Thiệu & Mục Tiêu Nghề Nghiệp</h3>
          <div className="input-group-full-width">
            <div className="input-container">
              <textarea
                required={true}
                name="introduction"
                value={cvData.introduction}
                onChange={handleChange}
                id="introduction"
                rows={4}
                placeholder=" "
              />
              <label className="label" htmlFor="introduction">
                Giới thiệu & Mục tiêu nghề nghiệp
              </label>
              <div className="underline"></div>
            </div>
          </div>

          <h3 className="section-title">Kỹ Năng</h3>
          <div className="input-group-full-width">
            <div className="input-container">
              <input
                required={true}
                type="text"
                name="professionalSkills"
                value={cvData.professionalSkills}
                onChange={handleChange}
                id="professionalSkills"
                placeholder=" "
              />
              <label className="label" htmlFor="professionalSkills">
                Kỹ năng chuyên môn
              </label>
              <div className="underline"></div>
            </div>
          </div>
          <div className="input-group-full-width">
            <div className="input-container">
              <input
                required={true}
                type="text"
                name="softSkills"
                value={cvData.softSkills}
                onChange={handleChange}
                id="softSkills"
                placeholder=" "
              />
              <label className="label" htmlFor="softSkills">
                Kỹ năng mềm
              </label>
              <div className="underline"></div>
            </div>
          </div>

          <h3 className="section-title">Học Vấn</h3>
          {cvData.education.map((edu, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group">
                <div className="input-container">
                  <input
                    required={true}
                    type="text"
                    name="university"
                    value={edu.university}
                    onChange={(e) => handleEducationChange(index, e)}
                    id={`university-${index}`}
                    placeholder=" "
                  />
                  <label className="label" htmlFor={`university-${index}`}>
                    Trường đại học
                  </label>
                  <div className="underline"></div>
                </div>
              </div>
              <div className="input-group">
                <div className="input-container">
                  <input
                    required={true}
                    type="text"
                    name="major"
                    value={edu.major}
                    onChange={(e) => handleEducationChange(index, e)}
                    id={`major-${index}`}
                    placeholder=" "
                  />
                  <label className="label" htmlFor={`major-${index}`}>
                    Chuyên ngành
                  </label>
                  <div className="underline"></div>
                </div>
              </div>
              <div className="input-group">
                <div className="input-container">
                  <input
                    required={true}
                    type="text"
                    name="gpa"
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(index, e)}
                    id={`gpa-${index}`}
                    placeholder=" "
                  />
                  <label className="label" htmlFor={`gpa-${index}`}>
                    GPA (../4)
                  </label>
                  <div className="underline"></div>
                </div>
              </div>
              <div className="input-group">
                <div className="input-container">
                  <input
                    required={true}
                    type="text"
                    name="year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, e)}
                    id={`year-${index}`}
                    placeholder=" "
                  />
                  <label className="label" htmlFor={`year-${index}`}>
                    Thời gian học
                  </label>
                  <div className="underline"></div>
                </div>
              </div>
              {cvData.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="remove-btn"
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEducation}
            className="add-btn"
          >
            Thêm Học Vấn
          </button>

          <h3 className="section-title">Kinh Nghiệm</h3>
          <div className="input-group-full-width">
            <div className="input-container">
              <textarea
                required={true}
                name="experience"
                value={cvData.experience}
                onChange={handleChange}
                id="experience"
                rows={4}
                placeholder=" "
              />
              <label className="label" htmlFor="experience">
                Kinh nghiệm làm việc
              </label>
              <div className="underline"></div>
            </div>
          </div>

          <h3 className="section-title">Dự Án</h3>
          {cvData.projects.map((project, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group-full-width">
                <div className="input-container">
                  <input
                    required={true}
                    type="text"
                    name="projectName"
                    value={project.projectName}
                    onChange={(e) => handleProjectChange(index, e)}
                    id={`projectName-${index}`}
                    placeholder=" "
                  />
                  <label className="label" htmlFor={`projectName-${index}`}>
                    Tên dự án
                  </label>
                  <div className="underline"></div>
                </div>
              </div>
              <div className="input-group-full-width">
                <div className="input-container">
                  <textarea
                    required={true}
                    name="projectDescription"
                    value={project.projectDescription}
                    onChange={(e) => handleProjectChange(index, e)}
                    id={`projectDescription-${index}`}
                    rows={3}
                    placeholder=" "
                  />
                  <label
                    className="label"
                    htmlFor={`projectDescription-${index}`}
                  >
                    Mô tả dự án
                  </label>
                  <div className="underline"></div>
                </div>
              </div>
              {cvData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  className="remove-btn"
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddProject} className="add-btn">
            Thêm Dự Án
          </button>

          <h3 className="section-title">Chứng Chỉ và Giải Thưởng</h3>
          <div className="input-group-full-width">
            <div className="input-container">
              <textarea
                required={true}
                name="certifications"
                value={cvData.certifications}
                onChange={handleChange}
                id="certifications"
                rows={4}
                placeholder=" "
              />
              <label className="label" htmlFor="certifications">
                Chứng chỉ
              </label>
              <div className="underline"></div>
            </div>
          </div>
          <div className="input-group-full-width">
            <div className="input-container">
              <textarea
                required={true}
                name="activitiesAwards"
                value={cvData.activitiesAwards}
                onChange={handleChange}
                id="activitiesAwards"
                rows={4}
                placeholder=" "
              />
              <label className="label" htmlFor="activitiesAwards">
                Hoạt động / Giải thưởng
              </label>
              <div className="underline"></div>
            </div>
          </div>
          <div className="cv-controls">
            <button onClick={handleCreateCV}>Tạo CV</button>
            <button style={{ background: "#484747ff" }}>Tiếng Anh</button>
            <button style={{ background: "#484747ff" }}>Tiếng Việt</button>
          </div>
        </div>
      </div>
      <ChatWithAI />
      <Footer />
    </div>
  );
};

export default BuildCV;
