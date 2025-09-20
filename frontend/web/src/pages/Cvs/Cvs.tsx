import React, { useEffect, useState } from "react";
import useUser from "../../hook/useUser";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";
import Swal from "sweetalert2";
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
        <h2 className="cvs-title">CV đã tạo trên SmartHire</h2>
        {cvs.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">
              Bạn chưa có CV nào. Hãy tạo CV đầu tiên của bạn!
            </p>
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
                      style={{ border: "none" }}
                      title={`cv-${cv._id}`}
                    />

                    <div className="cv-actions">
                      {/* Nút xem chi tiết */}
                      <button
                        className="view-detail-btn"
                        onClick={() => window.open(cv.fileUrls, "_blank")}
                      >
                        Xem chi tiết
                      </button>

                      {/* Nút xóa CV với Swal */}
                      <button
                        className="delete-cv-btn"
                        onClick={() => {
                          Swal.fire({
                            title: "Bạn có chắc muốn xóa CV này?",
                            text: "Hành động này không thể hoàn tác!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Xóa",
                            cancelButtonText: "Hủy",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setCvs((prev) =>
                                prev.filter((item) => item._id !== cv._id)
                              );
                              // TODO: gọi API xóa ở backend tại đây

                              Swal.fire({
                                title: "Đã xóa!",
                                text: "CV đã được xóa thành công.",
                                icon: "success",
                                confirmButtonColor: "#059669",
                              });
                            }
                          });
                        }}
                      >
                        Xóa CV
                      </button>
                    </div>
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
