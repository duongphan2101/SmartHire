import React, { useEffect } from "react";
import { useTerms } from "../../hook/useTerms";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import "./TermUser.css";

const TermUser: React.FC = () => {
  const { termsText, isLoading, fetchTerms } = useTerms();

  useEffect(() => {
    fetchTerms("user");
  }, [fetchTerms]);

  return (
    <div className="App-TermUser">
      <Header />
      <ChatWithAI />

      <div className="termuser-container">
        <div className="termuser-card">
          <h1 className="termuser-title">Điều khoản dành cho Người dùng</h1>
          <p className="termuser-subtitle">
            Vui lòng đọc kỹ trước khi tiếp tục sử dụng nền tảng SmartHire.
          </p>

          <div className="termuser-content">
            {isLoading ? (
              <div className="termuser-loading">Đang tải nội dung...</div>
            ) : (
              <pre className="termuser-text">
                {termsText || "Không tìm thấy nội dung điều khoản."}
              </pre>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermUser;
