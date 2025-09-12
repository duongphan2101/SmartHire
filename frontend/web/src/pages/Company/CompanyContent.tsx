import "./CompanyContent.css";
import Company from "../../components/Company-HR/Company";
import useCompany from "../../hook/useDepartment"; // Import hook mới


const CompanyContent = () => {
  const { loading, error } = useCompany();

  if (loading) {
    return <div>Đang tải dữ liệu công ty...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div style={{padding: '20px', backgroundColor: '#e0e0e0', height: '100%'}}>
      <Company />
    </div>
  );
};

export default CompanyContent;