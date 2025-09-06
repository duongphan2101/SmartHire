import React from "react";
import './Company.css';

// Khai báo interface cho props
interface CompanyProps {
  companies: {
    name: string;
    address: string;
    avatar: string;
    description: string;
    website: string;
  }[];
}

const Company = ({ companies }: CompanyProps) => {
  return (
    <div className="company-profile-container">
      {companies.map((company, index) => (
        <div key={index} className="company-card">
          <img src={company.avatar} alt={company.name} className="company-avatar" />
          <div className="company-details">
            <h3>{company.name}</h3>
            <p><strong>Address:</strong> {company.address}</p>
            <p><strong>Description:</strong> {company.description}</p>
            <p>
              <strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Company;