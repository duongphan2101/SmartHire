import React, { useState } from "react";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";
import "./BuildCV.css";

interface Education {
  degree: string;
  year: string;
  institution: string;
  grade: string;
}
  
interface CVData {
  name: string;
  address: string;
  phone: string;
  email: string;
  github: string;
  website: string;
  introduction: string;
  education: Education[];
  professionalSkills: string; 
  softSkills: string; 
  oLevels: string;
  webDevSkills: string; 
  otherWebDevSkills: string; 
  gpa: string;
  experience: string; 
  certifications: string; 
  languages: string;
  interests: string; 
  university: string;
  major: string;
  projects: string;
  activitiesAwards: string; 
}

const BuildCV: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>({
    name: "",
    address: "",
    phone: "",
    email: "",
    github: "",
    website: "",
    introduction: "",
    education: [{ degree: "", year: "", institution: "", grade: "" }],
    professionalSkills: "",
    softSkills: "",
    oLevels: "",
    webDevSkills: "",
    otherWebDevSkills: "",
    gpa: "",
    experience: "",
    certifications: "",
    languages: "",
    interests: "",
    university: "",
    major: "",
    projects: "",
    activitiesAwards: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCvData((prev) => ({ ...prev, [name]: value }));
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

  const handleCreateCV = () => {
    alert("CV đã được tạo! (Chức năng tải xuống có thể được thêm vào.)");
  };

  return (
    <div className="App">
      <Header />
      <div className="cv-builder">

        <div className="cv-template">
          <h2>{cvData.name || "[Họ và Tên]"}</h2>
          <div className="section">Thông Tin Cá Nhân</div>
          <div>Địa chỉ: {cvData.address || "[Địa chỉ]"}</div>
          <div>Số điện thoại: {cvData.phone || "[Số điện thoại]"}</div>
          <div>Email: {cvData.email || "[Email]"}</div>
          <div>Github: {cvData.github || "[Github]"}</div>
          <div>Website: {cvData.website || "[Website]"}</div>
          <div className="section">Giới Thiệu & Mục Tiêu Nghề Nghiệp</div>
          <div>{cvData.introduction || "[Giới thiệu & Mục tiêu]"}</div>
          <div className="section">Học Vấn</div>
          {cvData.education.map((edu, index) => (
            <div key={index}>
              {cvData.university || "[Trường đại học]"} -{" "}
              {cvData.major || "[Chuyên ngành]"} - {edu.year || "[Thời gian]"} (Điểm:{" "}
              {cvData.gpa || "[GPA]"})
            </div>
          ))}
          <div className="section">O-Levels</div>
          <div>{cvData.oLevels || "[Môn học]"}</div>
          <div className="section skills">Kỹ Năng</div>
          <div className="subsection">Kỹ Năng Chuyên Môn</div>
          <div className="skill-list">
            {cvData.professionalSkills ? (
              <div className="skill-item">{cvData.professionalSkills}</div>
            ) : (
              <div className="skill-item">[Kỹ năng chuyên môn]</div>
            )}
          </div>
          <div className="subsection">Kỹ Năng Mềm</div>
          <div className="skill-list">
            {cvData.softSkills ? (
              <div className="skill-item">{cvData.softSkills}</div>
            ) : (
              <div className="skill-item">[Kỹ năng mềm]</div>
            )}
          </div>
          <div className="section">Kinh Nghiệm</div>
          <div>{cvData.experience || "[Kinh nghiệm]"}</div>
          <div className="section">Chứng Chỉ</div>
          <div>{cvData.certifications || "[Chứng chỉ]"}</div>
          <div className="section">Dự Án</div>
          <div>{cvData.projects || "[Dự án]"}</div>
          <div className="section">Hoạt Động / Giải Thưởng</div>
          <div>{cvData.activitiesAwards || "[Hoạt động / Giải thưởng]"}</div>
          <div className="section">Ngôn Ngữ</div>
          <div>{cvData.languages || "[Ngôn ngữ]"}</div>
          <div className="section">Sở Thích</div>
          <div>{cvData.interests || "[Sở thích]"}</div>
          <div className="cv-controls">
            <button onClick={handleCreateCV}>Tạo CV</button>
            <button>Tiếng Anh</button>
            <button>Tiếng Việt</button>
          </div>
        </div>
        
        <div className="cv-input">
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={cvData.name}
              onChange={handleChange}
              id="name"
            />
            <label htmlFor="name">Họ Tên</label>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="phone"
              value={cvData.phone}
              onChange={handleChange}
              id="phone"
            />
            <label htmlFor="phone">Số điện thoại</label>
          </div>

          {/* Hàng 2: Email, Github, Website */}
          <div className="input-row">
            <div className="input-group">
              <input
                type="email"
                name="email"
                value={cvData.email}
                onChange={handleChange}
                id="email"
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-group">
              <input
                type="text"
                name="github"
                value={cvData.github}
                onChange={handleChange}
                id="github"
              />
              <label htmlFor="github">Github</label>
            </div>
            <div className="input-group">
              <input
                type="text"
                name="website"
                value={cvData.website}
                onChange={handleChange}
                id="website"
              />
              <label htmlFor="website">Website</label>
            </div>
          </div>
          
          {/* Giới thiệu */}
          <div className="input-group-full-width">
            <textarea
              name="introduction"
              value={cvData.introduction}
              onChange={handleChange}
              id="introduction"
              rows={4}
            />
            <label htmlFor="introduction">Giới thiệu & Mục tiêu nghề nghiệp</label>
          </div>
        
          <div className="input-group-full-width">
            <input
              type="text"
              name="professionalSkills"
              value={cvData.professionalSkills}
              onChange={handleChange}
              id="professionalSkills"
            />
            <label htmlFor="professionalSkills">Kỹ năng chuyên môn</label>
          </div>
          <div className="input-group-full-width">
            <input
              type="text"
              name="softSkills"
              value={cvData.softSkills}
              onChange={handleChange}
              id="softSkills"
            />
            <label htmlFor="softSkills">Kỹ năng mềm</label>
          </div>

         
          <div className="input-group">
            <input
              type="text"
              name="university"
              value={cvData.university}
              onChange={handleChange}
              id="university"
            />
            <label htmlFor="university">Trường đại học</label>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="major"
              value={cvData.major}
              onChange={handleChange}
              id="major"
            />
            <label htmlFor="major">Chuyên ngành</label>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="gpa"
              value={cvData.gpa}
              onChange={handleChange}
              id="gpa"
            />
            <label htmlFor="gpa">GPA (../4)</label>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="year"
              value={cvData.education[0].year}
              onChange={(e) => handleEducationChange(0, e)}
              id="year"
            />
            <label htmlFor="year">Thời gian học (2021-2025)</label>
          </div>
          <div className="input-group-full-width">
            <textarea
              name="certifications"
              value={cvData.certifications}
              onChange={handleChange}
              id="certifications"
              rows={4}
            />
            <label htmlFor="certifications">Chứng chỉ</label>
          </div>
          <div className="input-group-full-width">
            <textarea
              name="projects"
              value={cvData.projects}
              onChange={handleChange}
              id="projects"
              rows={4}
            />
            <label htmlFor="projects">Dự án</label>
          </div>
          <div className="input-group-full-width">
            <textarea
              name="experience"
              value={cvData.experience}
              onChange={handleChange}
              id="experience"
              rows={4}
            />
            <label htmlFor="experience">Kinh nghiệm</label>
          </div>
         
          <div className="input-group-full-width">
            <textarea
              name="activitiesAwards"
              value={cvData.activitiesAwards}
              onChange={handleChange}
              id="activitiesAwards"
              rows={4}
            />
            <label htmlFor="activitiesAwards">Hoạt động / Giải thưởng</label>
          </div>
        </div>

      </div>
      <ChatWithAI />
      <Footer />
    </div>
  );
};

export default BuildCV;