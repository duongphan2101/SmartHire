import React from "react";
import google from "../../assets/images/google.png";
import "./CompanyContent.css";

// Dữ liệu mẫu
const jobData = {
  id: 2,
  nameJob: "Frontend Developer",
  department: "Google",
  image: google,
  tech: ["HTML", "CSS", "JavaScript"],
  url: "/",
  location: "Ho Chi Minh City",
  salary: "$1,000 - $1,500",
  level: "Junior",
  type: "Hybrid",
  postedAt: "2025-08-10T08:30:00Z",
  updatedAt: null,
  isSaved: false,
  about: "Join Google's frontend team to create interactive, scalable, and user-friendly web applications.",
  responsibilities: [
    "Implement responsive UI with HTML, CSS, and JavaScript",
    "Work closely with designers and backend engineers",
    "Ensure cross-browser and cross-device compatibility",
    "Optimize application for speed and performance",
  ],
  requirements: [
    "Solid understanding of HTML, CSS, JavaScript",
    "Experience with modern frontend frameworks (React, Vue, Angular is a plus)",
    "Basic knowledge of REST APIs",
    "Good communication and teamwork",
  ],
  benefits: [
    "Flexible working schedule",
    "Free lunch and snacks",
    "Health & dental insurance",
    "Training budget",
  ],
  workingHours: "Mon - Fri, 10:00 AM - 7:00 PM",
};

const CompanyContent = () => {
  return (
    <div className="company-content">
      <div className="company-header">
        <img src={jobData.image} alt="Google Logo" className="company-logo" />
        <div className="company-info">
          <h1>{jobData.department}</h1>
          <div className="company-meta">
            <span>{jobData.location}</span> | <span>{jobData.type}</span> | <span>{jobData.level}</span>
          </div>
        </div>
      </div>
      <div className="company-sections">
        <div className="company-section">
          <h2>About Us</h2>
          <p>{jobData.about}</p>
        </div>
        <div className="company-section">
          <h2>Job Benefits</h2>
          <ul>
            {jobData.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
        <div className="company-section">
          <h2>Responsibilities</h2>
          <ul>
            {jobData.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
        <div className="company-section">
          <h2>Requirements</h2>
          <ul>
            {jobData.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
        <div className="company-section">
          <h2>Technologies</h2>
          <ul>
            {jobData.tech.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        </div>
        <div className="company-section">
          <h2>Job Details</h2>
          <p><strong>Salary:</strong> {jobData.salary}</p>
          <p><strong>Working Hours:</strong> {jobData.workingHours}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyContent;
// import React from 'react'

// const CompanyContent = () => {
//   return (
//     <div>CompanyContent</div>
//   )
// }

// export default CompanyContent