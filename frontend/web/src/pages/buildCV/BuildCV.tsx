import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";

import useCV from "../../hook/useCV";

import CVTemplate from "../../components/template-cv/CVTemplate";
import CVTemplate2 from "../../components/template-cv/cvtemplate2";
import CVTemplate3 from "../../components/template-cv/cvtemplate2";
import CVTemplate4 from "../../components/template-cv/cvtemplate2";
import CVTemplate5 from "../../components/template-cv/cvtemplate2";

import "./BuildCV.css";

import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import { uploadPDF } from "../../utils/uploadPDF";
import Modal_AI_Recomend from "../../components/Modal-AI-Recomend/Modal-AI-Recomend";

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
    education: [{ university: "", major: "", gpa: "", startYear: "", endYear: "" }],
    projects: [{ projectName: "", projectDescription: "" }],
  });

  const [currentLanguage, setCurrentLanguage] = useState<'vi' | 'en'>('vi');
  const [originalData, setOriginalData] = useState<CVData>({ ...cvData });
  const cvTemplateRef = useRef<HTMLDivElement>(null);
  const { createCV } = useCV();
  const [user, setUser] = useState<string>("");
  const [openModalSummary, setOpenModalSummary] = useState<boolean>(false);
  const [openModalEx, setOpenModalEx] = useState<boolean>(false);
  const [openModalDesProject, setOpenModalDesProject] = useState<boolean>(false);

  const professionalSkillOptions = [
    // Frontend
    "ReactJS", "React Native", "Vue.js", "Angular", "Svelte", "HTML5", "CSS3", "JavaScript", "TypeScript", "Next.js", "Nuxt.js",
    // Backend
    "Node.js", "Express", "NestJS", "Spring Boot", "Java", "Python", "Django", "Flask", "Ruby on Rails", "PHP", "Laravel", "Go",
    // Database
    "MongoDB", "MySQL", "PostgreSQL", "Redis", "DynamoDB", "Firebase",
    // DevOps / Cloud
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Git", "Linux",
    // Mobile
    "Swift", "Objective-C", "Kotlin", "Flutter",
    // AI / ML / Data
    "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Machine Learning", "Deep Learning",
    // Others
    "REST API", "GraphQL", "WebSockets", "Microservices", "Unit Testing", "Jest", "Cypress", "Agile", "Scrum"
  ];

  const softSkillOptions = [
    "Teamwork", "Communication", "Problem Solving", "Critical Thinking", "Leadership",
    "Time Management", "Adaptability", "Creativity", "Conflict Resolution", "Emotional Intelligence",
    "Collaboration", "Decision Making", "Analytical Thinking", "Presentation Skills",
    "Negotiation", "Attention to Detail", "Flexibility", "Motivation", "Work Ethic", "Active Listening",
    "Networking", "Persuasion", "Stress Management", "Self-Discipline"
  ];

  const [profSkills, setProfSkills] = useState<string[]>(cvData.professionalSkills ? cvData.professionalSkills.split(",") : []);
  const [softSkills, setSoftSkills] = useState<string[]>(cvData.softSkills ? cvData.softSkills.split(",") : []);
  const [profInput, setProfInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  const [filteredProfSkills, setFilteredProfSkills] = useState<string[]>([]);
  const [filteredSoftSkills, setFilteredSoftSkills] = useState<string[]>([]);
  const [showProfSuggestion, setShowProfSuggestion] = useState(false);
  const [showSoftSuggestion, setShowSoftSuggestion] = useState(false);


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
    setFilteredProfSkills(professionalSkillOptions.filter(opt => opt.toLowerCase().includes(value.toLowerCase())));
  };

  const handleSoftInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSoftInput(value);
    setFilteredSoftSkills(softSkillOptions.filter(opt => opt.toLowerCase().includes(value.toLowerCase())));
  };

  const addProfSkill = (skill: string) => {
    if (!profSkills.includes(skill)) {
      setProfSkills([...profSkills, skill]);
    }
    setProfInput("");
    setFilteredProfSkills([]);
  };

  const addSoftSkill = (skill: string) => {
    if (!softSkills.includes(skill)) {
      setSoftSkills([...softSkills, skill]);
    }
    setSoftInput("");
    setFilteredSoftSkills([]);
  };

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
      setCvData(prev => ({ ...prev, professionalSkills: newSkills.join(",") }));
    }
    setProfInput("");
    setShowProfSuggestion(false);
  };

  const handleSelectSoftSkill = (skill: string) => {
    if (!softSkills.includes(skill)) {
      const newSkills = [...softSkills, skill];
      setSoftSkills(newSkills);
      setCvData(prev => ({ ...prev, softSkills: newSkills.join(",") }));
    }
    setSoftInput("");
    setShowSoftSuggestion(false);
  };

  // Remove skill
  const handleRemoveProfSkill = (skill: string) => {
    const newSkills = profSkills.filter(s => s !== skill);
    setProfSkills(newSkills);
    setCvData(prev => ({ ...prev, professionalSkills: newSkills.join(",") }));
  };

  const handleRemoveSoftSkill = (skill: string) => {
    const newSkills = softSkills.filter(s => s !== skill);
    setSoftSkills(newSkills);
    setCvData(prev => ({ ...prev, softSkills: newSkills.join(",") }));
  };


  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const idToFetch = parsed.user_id ?? parsed._id;
        setUser(idToFetch);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Bạn cần đăng nhập",
          text: "Vui lòng đăng nhập để tiếp tục!",
          showCancelButton: true,
          confirmButtonText: "Đăng nhập",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            window.location.href = "/home";
          }
        });
      }
    } catch (e) {
      console.error("Invalid user data in localStorage", e);
      Swal.fire({
        icon: "error",
        title: "Lỗi dữ liệu",
        text: "Thông tin đăng nhập không hợp lệ. Vui lòng đăng nhập lại!",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          window.location.href = "/home";
        }
      });
    }
  }, []);

  type TemplateKey = "template1" | "template2" | "template3" | "template4" | "template5";
  const templates: Record<TemplateKey, React.ForwardRefExoticComponent<any>> = {
    template1: CVTemplate,
    template2: CVTemplate2,
    template3: CVTemplate3,
    template4: CVTemplate4,
    template5: CVTemplate5,
  };

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('template1');
  const templateKeys = Object.keys(templates) as TemplateKey[];
  const CurrentTemplate = templates[selectedTemplate];

  const handlePrevTemplate = () => {
    const idx = templateKeys.indexOf(selectedTemplate);
    const newIndex = idx === 0 ? templateKeys.length - 1 : idx - 1;
    setSelectedTemplate(templateKeys[newIndex]);
  };

  const handleNextTemplate = () => {
    const idx = templateKeys.indexOf(selectedTemplate);
    const newIndex = idx === templateKeys.length - 1 ? 0 : idx + 1;
    setSelectedTemplate(templateKeys[newIndex]);
  };

  const handleSelectTemplate = (key: TemplateKey) => setSelectedTemplate(key);

  // --- Handle input changes ---
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

  const handleAddEducation = () => {
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, { university: "", major: "", gpa: "", startYear: "", endYear: "" }],
    }));
    setOriginalData((prev) => ({
      ...prev,
      education: [...prev.education, { university: "", major: "", gpa: "", startYear: "", endYear: "" }],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = cvData.education.filter((_, i) => i !== index);
    setCvData((prev) => ({ ...prev, education: newEducation }));
    const newOriginalEducation = originalData.education.filter((_, i) => i !== index);
    setOriginalData((prev) => ({ ...prev, education: newOriginalEducation }));
  };

  const handleProjectChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleEducationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCvData(prev => {
      const newEducation = [...prev.education];
      newEducation[index][name as keyof Education] = value;
      return { ...prev, education: newEducation };
    });
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
          startYear: edu.startYear,
          endYear: edu.endYear,
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
    if (!element) return Swal.fire("Lỗi", "Không tìm thấy nội dung CV để tạo PDF.", "error");

    try {
      window.scrollTo(0, 0);
      // Hiển thị loading
      Swal.fire({
        title: "Đang tạo CV...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Tạo PDF
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

      const pdfBlob = pdf.output("blob");

      const pdfUrl = await uploadPDF(pdfBlob, `cv-${user}_${Date.now()}.pdf`);
      const userId = user || "";

      await createCV(userId, cvData, pdfUrl);

      Swal.fire("Thành công", "CV đã được tạo!", "success");
    } catch (error) {
      console.error("Lỗi khi tạo CV:", error);
      Swal.fire("Lỗi", "Đã xảy ra lỗi khi tạo CV. Vui lòng thử lại.", "error");
    }
  };

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

  return (
    <div className="App" style={{ backgroundColor: '#e5e7eb' }}>
      <Header />
      <div className="cv-builder">
        {/* --- Template rendering with selector --- */}
        <div className="rendering-template">

          <div className="template-box">
            <button className="btn-template btn-template-prev" onClick={handlePrevTemplate}>
              <BiSkipPrevious size={20} />
            </button>
            <ul className="flex gap-3">
              {templateKeys.map((key, index) => {
                const total = templateKeys.length;

                if (
                  index === 0 ||
                  index === total - 1 ||
                  Math.abs(index - templateKeys.indexOf(selectedTemplate)) <= 1
                ) {
                  return (
                    <li
                      key={key}
                      className={`btn-template ${selectedTemplate === key ? "active" : ""}`}
                      onClick={() => handleSelectTemplate(key)}
                    >
                      {index + 1}
                    </li>
                  );
                }

                if (
                  (index === 1 && templateKeys.indexOf(selectedTemplate) > 2) ||
                  (index === total - 2 &&
                    templateKeys.indexOf(selectedTemplate) < total - 3)
                ) {
                  return (
                    <li key={key} className="btn-template disabled">
                      ...
                    </li>
                  );
                }

                return null;
              })}
            </ul>

            <button className="btn-template btn-template-next" onClick={handleNextTemplate}>
              <BiSkipNext size={20} />
            </button>
          </div>

          <CurrentTemplate ref={cvTemplateRef} cvData={cvData} currentLanguage={currentLanguage} />

        </div>

        {/* --- Form input section --- */}
        <div className="cv-input">
          <h3 className="section-title">{currentLanguage === 'vi' ? "Thông Tin Cá Nhân" : "Personal Information"}</h3>
          <div className="input-row">
            <div className="input-group">
              <div className="input-container">
                <input
                  className="input-container_input"
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
                  className="input-container_input"
                  required={true}
                  id="phone"
                  type="tel"
                  name="phone"
                  value={cvData.contact.phone}
                  onChange={handleContactChange}
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
                  className="input-container_input"
                  required={true}
                  id="email"
                  type="email"
                  name="email"
                  value={cvData.contact.email}
                  onChange={handleContactChange}
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
                  className="input-container_input"
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
                  className="input-container_input"
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

            {openModalSummary && (
              <div className="box-ai-recomend">
                <Modal_AI_Recomend
                  content={cvData.introduction}
                  onClose={closeCVAIModalSummary}
                  type="Summary"
                  onApply={(suggestion) => {
                    setCvData((prev) => ({ ...prev, introduction: suggestion }));
                  }}
                />
              </div>
            )}

            <div className="input-container">
              <textarea
                required={true}
                className="input-container_input"
                name="introduction"
                value={cvData.introduction}
                onChange={handleChange}
                id="introduction"
                rows={4}
              // onFocus={turnOnRecomendSummary}
              // onBlur={closeCVAIModalSummary}
              />
              <label className="label" htmlFor="introduction">
                {currentLanguage === 'vi' ? "Giới thiệu & Mục tiêu nghề nghiệp" : "Introduction & Career Objective"}
              </label>
              {/* <div className="underline"></div> */}
              <div className="flex justify-end" style={{ paddingTop: 10 }}>
                <button className="text-white btn-suggest bg-emerald-600" onClick={turnOnRecomendSummary}>
                  Gợi ý
                </button>
              </div>

            </div>
          </div>

          {/* Skill */}
          <h3 className="section-title">{currentLanguage === 'vi' ? "Kỹ Năng" : "Skills"}</h3>
          <div className="input-container" style={{ position: "relative" }}>
            {/* <label>Professional Skills</label> */}
            <div className="multi-input">
              {profSkills.map(skill => (
                <span className="tag" key={skill}>
                  {skill} <span onClick={() => handleRemoveProfSkill(skill)}>x</span>
                </span>
              ))}
              <input
                className="input-container_input"
                value={profInput}
                onChange={handleProfInputChange}
                onFocus={handleProfFocus}
                onBlur={handleProfBlur}
                onKeyDown={handleProfKeyDown}
                placeholder="Thêm kỹ năng chuyên môn..."
              />
            </div>

            {showProfSuggestion && filteredProfSkills.length > 0 && (
              <ul className="suggestion-list">
                {filteredProfSkills.map(skill => (
                  <li key={skill} onMouseDown={() => handleSelectProfSkill(skill)}>{skill}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="input-container" style={{ position: "relative" }}>
            {/* <label>Soft Skills</label> */}
            <div className="multi-input">
              {softSkills.map(skill => (
                <span className="tag" key={skill}>
                  {skill} <span onClick={() => handleRemoveSoftSkill(skill)}>x</span>
                </span>
              ))}
              <input
                className="input-container_input"
                value={softInput}
                onChange={handleSoftInputChange}
                onFocus={handleSoftFocus}
                onBlur={handleSoftBlur}
                onKeyDown={handleSoftKeyDown}
                placeholder="Thêm kỹ năng mềm..."
              />
            </div>

            {showSoftSuggestion && filteredSoftSkills.length > 0 && (
              <ul className="suggestion-list">
                {filteredSoftSkills.map(skill => (
                  <li key={skill} onMouseDown={() => handleSelectSoftSkill(skill)}>{skill}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Hoc van */}
          <h3 className="section-title">{currentLanguage === 'vi' ? "Học Vấn" : "Education"}</h3>
          {cvData.education.map((edu, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group">
                <div className="input-container">
                  <input
                    className="input-container_input"
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
                    className="input-container_input"
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

              <div className="flex gap-2">
                {/* GPA - 30% width */}
                <div className="input-group flex-[3]">
                  <div className="input-container">
                    <input
                      className="input-container_input"
                      required
                      type="number"
                      name="gpa"
                      value={edu.gpa}
                      onChange={(e) => handleEducationChange(index, e)}
                      id={`gpa-${index}`}
                      min={1}
                      max={4}
                      step={0.01}
                    />
                    <label className="label" htmlFor={`gpa-${index}`}>
                      GPA (../4)
                    </label>
                    <div className="underline"></div>
                  </div>
                </div>

                {/* Năm học - 70% width */}
                <div className="input-group flex-[7] flex gap-2">
                  {/* Năm bắt đầu */}
                  <div className="input-container flex-1">
                    <input
                      className="input-container_input"
                      required
                      type="number"
                      name="startYear"
                      value={edu.startYear ?? ""}
                      onChange={(e) => handleEducationChange(index, e)}
                      id={`startYear-${index}`}
                      placeholder=" "
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                    <label className="label" htmlFor={`startYear-${index}`}>
                      {currentLanguage === "vi" ? "Từ năm" : "Start Year"}
                    </label>
                    <div className="underline"></div>
                  </div>

                  {/* Năm kết thúc */}
                  <div className="input-container flex-1">
                    <input
                      className="input-container_input"
                      required
                      type="number"
                      name="endYear"
                      value={edu.endYear ?? ""}
                      onChange={(e) => handleEducationChange(index, e)}
                      id={`endYear-${index}`}
                      placeholder=" "
                      min={1900}
                      max={new Date().getFullYear() + 10}
                    />
                    <label className="label" htmlFor={`endYear-${index}`}>
                      {currentLanguage === "vi" ? "Đến năm" : "End Year"}
                    </label>
                    <div className="underline"></div>
                  </div>
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

          {/* Kinh nghiem */}
          <h3 className="section-title">{currentLanguage === 'vi' ? "Kinh Nghiệm" : "Experience"}</h3>
          <div className="input-group-full-width">

            {openModalEx && (
              <div className="box-ai-recomend">
                <Modal_AI_Recomend
                  content={cvData.experience}
                  onClose={closeCVAIModalEx}
                  type="Experience"
                  onApply={(suggestion) => {
                    setCvData((prev) => ({ ...prev, experience: suggestion }));
                  }}
                />
              </div>
            )}

            <div className="input-container">
              <textarea
                className="input-container_input"
                required={true}
                name="experience"
                value={cvData.experience}
                onChange={handleChange}
                id="experience"
                rows={4}
              />
              <label className="label" htmlFor="experience">
                {currentLanguage === 'vi' ? "Kinh nghiệm làm việc" : "Work Experience"}
              </label>
              {/* <div className="underline"></div> */}
              <div className="flex justify-end" style={{ paddingTop: 10 }}>
                <button className="text-white btn-suggest bg-emerald-600" onClick={turnOnRecomendEx}>
                  Gợi ý
                </button>
              </div>
            </div>
          </div>

          {/* Du an */}
          <h3 className="section-title">{currentLanguage === 'vi' ? "Dự Án" : "Projects"}</h3>
          {cvData.projects.map((project, index) => (
            <div key={index} className="dynamic-input-group">
              <div className="input-group-full-width">
                <div className="input-container">
                  <input
                    className="input-container_input"
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

                {openModalDesProject && (
                  <div className="box-ai-recomend">
                    <Modal_AI_Recomend
                      content={project.projectDescription}
                      onClose={closeCVAIModalDesProject}
                      type="ProjectDescription"
                      onApply={(suggestion) => {
                        setCvData((prev) => ({
                          ...prev,
                          projects: [{ projectName: prev.projects[0]?.projectName || "", projectDescription: suggestion }]
                        }));
                      }}
                    />
                  </div>
                )}

                <div className="input-container">
                  <textarea
                    className="input-container_input"
                    required={true}
                    name="projectDescription"
                    value={project.projectDescription}
                    onChange={(e) => handleProjectChange(index, e)}
                    id={`projectDescription-${index}`}
                    rows={3}
                  />
                  <label
                    className="label"
                    htmlFor={`projectDescription-${index}`}
                  >
                    {currentLanguage === 'vi' ? "Mô tả dự án" : "Project Description"}
                  </label>
                  {/* <div className="underline"></div> */}
                  <div className="flex justify-end" style={{ paddingTop: 10 }}>
                    <button className="text-white btn-suggest bg-emerald-600" onClick={turnOnRecomendDesProject}>
                      Gợi ý
                    </button>
                  </div>
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

          {/* Chung chi */}
          <h3 className="section-title">{currentLanguage === 'vi' ? "Chứng Chỉ và Giải Thưởng" : "Certifications and Awards"}</h3>
          <div className="input-group-full-width">
            <div className="input-container">
              <textarea
                className="input-container_input"
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
                className="input-container_input"
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
    </div >
  );
};

export default BuildCV;
