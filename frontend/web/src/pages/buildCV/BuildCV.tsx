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
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>Họ và Tên:</label>
              <input
                type="text"
                name="name"
                value={cvData.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={cvData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>Email:</label>
              <input
                type="email"
                name="email"
                value={cvData.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>Github:</label>
              <input
                type="text"
                name="github"
                value={cvData.github}
                onChange={handleChange}
                placeholder="Nhập Github"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>Website:</label>
              <input
                type="text"
                name="website"
                value={cvData.website}
                onChange={handleChange}
                placeholder="Nhập Website"
              />
            </div>
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "flex-start" }}>
              Giới thiệu & Mục tiêu nghề nghiệp:
            </label>
            <textarea
              name="introduction"
              value={cvData.introduction}
              onChange={handleChange}
              placeholder="Nhập giới thiệu & mục tiêu nghề nghiệp"
              rows={4}
              style={{
                width: "100%",
                maxWidth: "500px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <h3 style={{ display: "flex", alignItems: "flex-start" }}>Kỹ năng</h3>
          <label style={{ display: "flex", alignItems: "flex-start" }}>Kỹ năng chuyên môn:</label>
          <input
            type="text"
            name="professionalSkills"
            value={cvData.professionalSkills}
            onChange={handleChange}
            placeholder="Nhập kỹ năng chuyên môn"
          />
          <label style={{ display: "flex", alignItems: "flex-start" }}>Kỹ năng mềm:</label>
          <input
            type="text"
            name="softSkills"
            value={cvData.softSkills}
            onChange={handleChange}
            placeholder="Nhập kỹ năng mềm"
          />

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>Trường đại học:</label>
              <input
                type="text"
                name="university"
                value={cvData.university}
                onChange={handleChange}
                placeholder="Nhập trường đại học"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>Chuyên ngành:</label>
              <input
                type="text"
                name="major"
                value={cvData.major}
                onChange={handleChange}
                placeholder="Nhập chuyên ngành"
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>GPA:</label>
              <input
                type="text"
                name="gpa"
                value={cvData.gpa}
                onChange={handleChange}
                placeholder="Nhập GPA(../4)"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "flex-start" }}>Thời gian học:</label>
              <input
                type="text"
                name="year"
                value={cvData.education[0].year}
                onChange={(e) => handleEducationChange(0, e)}
                placeholder="Nhập thời gian học"
              />
            </div>
          </div>
          <h3 style={{ display: "flex", alignItems: "flex-start" }}>Chứng chỉ</h3>
          <textarea
            name="certifications"
            value={cvData.certifications}
            onChange={handleChange}
            placeholder="Nhập chứng chỉ"
            rows={4}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <h3 style={{ display: "flex", alignItems: "flex-start" }}>Dự án</h3>
          <textarea
            name="projects"
            value={cvData.projects}
            onChange={handleChange}
            placeholder="Nhập dự án"
            rows={4}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <h3 style={{ display: "flex", alignItems: "flex-start" }}>Kinh nghiệm làm việc/Thực tập</h3>
          <textarea
            name="experience"
            value={cvData.experience}
            onChange={handleChange}
            placeholder="Nhập kinh nghiệm"
            rows={4}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <h3 style={{ display: "flex", alignItems: "flex-start" }}>Hoạt động/Giải thưởng</h3>
          <textarea
            name="activitiesAwards"
            value={cvData.activitiesAwards}
            onChange={handleChange}
            placeholder="Nhập hoạt động/giải thưởng"
            rows={4}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <h3 style={{ display: "flex", alignItems: "flex-start" }}>Ngôn ngữ</h3>
          <input
            type="text"
            name="languages"
            value={cvData.languages}
            onChange={handleChange}
            placeholder="Nhập ngôn ngữ"
          />
          <h3 style={{ display: "flex", alignItems: "flex-start" }}>Sở thích</h3>
          <input
            type="text"
            name="interests"
            value={cvData.interests}
            onChange={handleChange}
            placeholder="Nhập sở thích"
          />
        </div>
      </div>
      <ChatWithAI />
      <Footer />
    </div>
  );
};

export default BuildCV;