import React, { useEffect } from "react";
import { useTerms } from "../../hook/useTerms";
import "./TermHR.css";

const TermHR: React.FC = () => {
  const { termsText, isLoading, fetchTerms } = useTerms();

  useEffect(() => {
    fetchTerms("hr");
  }, [fetchTerms]);

  return (
    <div className="termhr-container">
      <div className="termhr-header">
        <h2>Điều khoản dành cho Nhà tuyển dụng</h2>
        <p className="termhr-subtitle">
          Vui lòng đọc kỹ trước khi tiếp tục sử dụng nền tảng SmartHire.
        </p>
      </div>

      <div className="termhr-content">
        {isLoading ? (
          <div className="termhr-loading">Đang tải điều khoản...</div>
        ) : (
          <pre className="termhr-text">
            {termsText || "Không tìm thấy nội dung điều khoản."}
          </pre>
        )}
      </div>
    </div>
  );
};

export default TermHR;
