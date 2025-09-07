import "./Company.css";

interface CompanyProps {
  company: {
    name: string;
    address: string;
    avatar: string;
    description: string;
    website: string;
  } | null;
}

const Company = ({ company }: CompanyProps) => {
  if (!company) return <p>Không có dữ liệu công ty</p>;

  return (
    <div className="company-profile-container">
      <div className="company-card">
        <img src={company.avatar} alt={company.name} className="company-profile-avatar" />
        <div className="company-details">
          <h3>{company.name}</h3>
          <p><strong>Address:</strong> {company.address}</p>
          <p><strong>Description:</strong> {company.description}</p>
          <p>
            <strong>Website:</strong>{" "}
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              {company.website}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Company;
