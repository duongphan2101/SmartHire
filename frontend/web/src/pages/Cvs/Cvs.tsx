import React, { useEffect, useState } from "react";
import useUser from "../../hook/useUser";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";
import "./Cvs.css";

const Cvs: React.FC = () => {
  const { getUser, user, loadingUser } = useUser();
  const [cvs, setCvs] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const idToFetch = parsed.user_id ?? parsed._id;
      getUser(idToFetch);
    }
  }, [getUser]);

  useEffect(() => {
    if (user && user.cv) {
      setCvs(user.cv);
    }
  }, [user]);

  if (loadingUser) return <p className="loading">Đang tải CV...</p>;

  return (
    <div className="App">
      <Header />
      <ChatWithAI />

      <div className="cvs-container">
 <h2 className="cvs-title">Tủ CV của bạn</h2>
        {cvs.length === 0 ? (
            
          <div className="empty-state">
            <p className="empty-text">Bạn chưa có CV nào. Hãy tạo CV đầu tiên của bạn!</p>
            <button className="create-cv-button">Tạo CV mới</button>
          </div>
        ) : (
            
          <div className="cv-list-grid">
            {cvs.map((cv) => (
              <div className="cv-card" key={cv._id}>
                {cv.fileUrls ? (
                  <>
                    {/* Preview bằng Google Docs Viewer */}
                    <iframe
                      src={`https://docs.google.com/gview?url=${cv.fileUrls}&embedded=true`}
                      width="100%"
                      height="400px"
                      style={{ border: "none", borderRadius: "8px" }}
                      title={`cv-${cv._id}`}
                    />

                    {/* Nút xem chi tiết */}
                    <button
                      className="view-detail-btn"
                      onClick={() => window.open(cv.fileUrls, "_blank")}
                    >
                     Xem chi tiết
                    </button>
                  </>
                ) : (
                  <p className="no-file">Không tìm thấy file CV</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cvs;
