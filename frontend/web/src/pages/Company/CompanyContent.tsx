import React from "react";
import "./CompanyContent.css";
import Company from "../../components/Company-HR/Company";
import useCompany from "../../hook/useDepartment"; // Import hook mới

const CompanyContent = () => {
  const { departments, loading, error } = useCompany();

  if (loading) {
    return <div>Đang tải dữ liệu công ty...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <Company companies={departments} />
    </div>
  );
};

export default CompanyContent;