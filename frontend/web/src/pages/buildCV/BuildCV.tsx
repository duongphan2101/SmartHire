import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";
import CVTemplate from "../../components/template-cv/CVTemplate";
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

  const [currentLanguage, setCurrentLanguage] = useState<'vi' | 'en'>('vi');
  const [originalData, setOriginalData] = useState<CVData>({ ...cvData });
  const cvTemplateRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCvData((prev) => ({ ...prev, [name]: value }));
    setOriginalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCvData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
    setOriginalData((prev) => ({
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
    const newOriginalEducation = originalData.education.map((edu, i) =>
      i === index ? { ...edu, [name]: value } : edu
    );
    setOriginalData((prev) => ({ ...prev, education: newOriginalEducation }));
  };

  const handleAddEducation = () => {
    setCvData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { university: "", major: "", gpa: "", year: "" },
      ],
    }));
    setOriginalData((prev) => ({
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
    const newOriginalEducation = originalData.education.filter((_, i) => i !== index);
    setOriginalData((prev) => ({ ...prev, education: newOriginalEducation }));
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
    const newOriginalProjects = originalData.projects.map((project, i) =>
      i === index ? { ...project, [name]: value } : project
    );
    setOriginalData((prev) => ({ ...prev, projects: newOriginalProjects }));
  };

  const handleAddProject = () => {
    setCvData((prev) => ({
      ...prev,
      projects: [...prev.projects, { projectName: "", projectDescription: "" }],
    }));
    setOriginalData((prev) => ({
      ...prev,
      projects: [...prev.projects, { projectName: "", projectDescription: "" }],
    }));
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = cvData.projects.filter((_, i) => i !== index);
    setCvData((prev) => ({ ...prev, projects: newProjects }));
    const newOriginalProjects = originalData.projects.filter((_, i) => i !== index);
    setOriginalData((prev) => ({ ...prev, projects: newOriginalProjects }));
  };

  const handleTranslate = async (targetLang: 'vi' | 'en') => {
    if (targetLang === 'vi') {
      setCvData(originalData);
      setCurrentLanguage('vi');
      return;
    }

    try {
      const dataToTranslate = { ...originalData };
      const translatedData: any = {};

      const translateText = async (text: string) => {
        if (!text) return "";
        const res = await fetch("https://libretranslate.com/translate", {
          method: "POST",
          body: JSON.stringify({
            q: text,
            source: "vi",
            target: "en",
            format: "text",
            api_key: ""
          }),
          headers: { "Content-Type": "application/json" }
        });
        const result = await res.json();
        return result.translatedText;
      };

      translatedData.name = await translateText(dataToTranslate.name);
      translatedData.introduction = await translateText(dataToTranslate.introduction);
      translatedData.professionalSkills = await translateText(dataToTranslate.professionalSkills);
      translatedData.softSkills = await translateText(dataToTranslate.softSkills);
      translatedData.experience = await translateText(dataToTranslate.experience);
      translatedData.certifications = await translateText(dataToTranslate.certifications);
      translatedData.activitiesAwards = await translateText(dataToTranslate.activitiesAwards);

      translatedData.contact = { ...dataToTranslate.contact };

      translatedData.education = await Promise.all(
        dataToTranslate.education.map(async (edu) => ({
          university: await translateText(edu.university),
          major: await translateText(edu.major),
          gpa: edu.gpa,
          year: edu.year,
        }))
      );

      translatedData.projects = await Promise.all(
        dataToTranslate.projects.map(async (project) => ({
          projectName: await translateText(project.projectName),
          projectDescription: await translateText(project.projectDescription),
        }))
      );

      setCvData(translatedData);
      setCurrentLanguage(targetLang);
      alert("CV đã được dịch sang Tiếng Anh!");
    } catch (error) {
      console.error("Lỗi khi dịch:", error);
      alert("Đã xảy ra lỗi khi dịch CV. Vui lòng thử lại.");
    }
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
        pdf.save("cv.pdf");
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
        {/* cv-template */}
        <CVTemplate ref={cvTemplateRef} cvData={cvData} currentLanguage={currentLanguage} />
        <div className="cv-input">
          <h3 className="section-title">{currentLanguage === 'vi' ? "Thông Tin Cá Nhân" : "Personal Information"}</h3>
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
                  {currentLanguage === 'vi' ? "Họ Tên" : "Full Name"}
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
                  {currentLanguage === 'vi' ? "Số điện thoại" : "Phone"}
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
          <h3 className="section-title">{currentLanguage === 'vi' ? "Giới Thiệu & Mục Tiêu Nghề Nghiệp" : "Introduction & Career Objective"}</h3>
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
                {currentLanguage === 'vi' ? "Giới thiệu & Mục tiêu nghề nghiệp" : "Introduction & Career Objective"}
              </label>
              <div className="underline"></div>
            </div>
          </div>
          <h3 className="section-title">{currentLanguage === 'vi' ? "Kỹ Năng" : "Skills"}</h3>
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
                {currentLanguage === 'vi' ? "Kỹ năng chuyên môn" : "Professional skills"}
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
                {currentLanguage === 'vi' ? "Kỹ năng mềm" : "Soft skills"}
              </label>
              <div className="underline"></div>
            </div>
          </div>
          <h3 className="section-title">{currentLanguage === 'vi' ? "Học Vấn" : "Education"}</h3>
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
                    {currentLanguage === 'vi' ? "Trường đại học" : "University"}
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
                    {currentLanguage === 'vi' ? "Chuyên ngành" : "Major"}
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
                    {currentLanguage === 'vi' ? "Thời gian học" : "Year"}
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
                  {currentLanguage === 'vi' ? "Xóa" : "Remove"}
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEducation}
            className="add-btn"
          >
            {currentLanguage === 'vi' ? "Thêm Học Vấn" : "Add Education"}
          </button>
          <h3 className="section-title">{currentLanguage === 'vi' ? "Kinh Nghiệm" : "Experience"}</h3>
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
                {currentLanguage === 'vi' ? "Kinh nghiệm làm việc" : "Work Experience"}
              </label>
              <div className="underline"></div>
            </div>
          </div>
          <h3 className="section-title">{currentLanguage === 'vi' ? "Dự Án" : "Projects"}</h3>
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
                    {currentLanguage === 'vi' ? "Tên dự án" : "Project Name"}
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
                    {currentLanguage === 'vi' ? "Mô tả dự án" : "Project Description"}
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
                  {currentLanguage === 'vi' ? "Xóa" : "Remove"}
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddProject} className="add-btn">
            {currentLanguage === 'vi' ? "Thêm Dự Án" : "Add Project"}
          </button>
          <h3 className="section-title">{currentLanguage === 'vi' ? "Chứng Chỉ và Giải Thưởng" : "Certifications and Awards"}</h3>
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
                {currentLanguage === 'vi' ? "Chứng chỉ" : "Certifications"}
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
                {currentLanguage === 'vi' ? "Hoạt động / Giải thưởng" : "Activities / Awards"}
              </label>
              <div className="underline"></div>
            </div>
          </div>
          <div className="cv-controls">
            <button onClick={handleCreateCV}>Tạo CV</button>
            <button style={{ background: "#484747ff" }} onClick={() => handleTranslate('en')}>Tiếng Anh</button>
            <button style={{ background: "#484747ff" }} onClick={() => handleTranslate('vi')}>Tiếng Việt</button>
          </div>
        </div>
      </div>
      <ChatWithAI />
      <Footer />
    </div>
  );
};

export default BuildCV;