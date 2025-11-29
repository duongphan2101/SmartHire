import React, { useEffect, useState } from "react";
import useUser from "../../hook/useUser";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";
import Swal from "sweetalert2";
import "./Cvs.css";
import type { ChatRoom } from "../../utils/interfaces";
import ChatModal from "../../components/Chat/Chat";
import { HOSTS } from "../../utils/host";
import CVViewer from "../../components/Preview-PDF/PdfPreview";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Cvs: React.FC = () => {
  const { getUser, user, loadingUser } = useUser();
  const [cvs, setCvs] = useState<any[]>([]);
  const [openChat, setIsChatOpen] = useState(false);
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null);
  
  // Khởi tạo navigate
  const navigate = useNavigate();

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

  const handleDeleteCV = async (cvId: string) => {
    try {
      const res = await fetch(`${HOSTS.cvService}/${cvId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Xóa CV thất bại");

      setCvs((prev) => prev.filter((item) => item._id !== cvId));

      Swal.fire({
        title: "Đã xóa!",
        text: "CV đã được xóa thành công.",
        icon: "success",
        confirmButtonColor: "#059669",
      });
    } catch (error) {
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể xóa CV. Vui lòng thử lại.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (loadingUser) return <p className="loading">Đang tải CV...</p>;

  const handleOpenChatRequest = (room?: ChatRoom) => {
    if (room) {
      setCurrentChatRoom(room);
    }
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // Hàm xử lý chỉnh sửa CV
  const handleEditCV = (cvId: string) => {
    // Chuyển hướng sang trang BuildCV với params id
    navigate(`/buildCV?id=${cvId}`);
  };

  return (
    <div className="App">
      <Header onOpenChat={handleOpenChatRequest} />

      {openChat && (
        <ChatModal room={currentChatRoom} onClose={handleCloseChat} />
      )}
      <ChatWithAI />

      <div className="cvs-container">
        <h2 className="cvs-title">Danh sách CV</h2>
        {cvs.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">
              Bạn chưa có CV nào. Hãy tạo CV đầu tiên của bạn!
            </p>
            <a href="/buildCV" className="create-cv-button">
              Tạo CV mới
            </a>
          </div>
        ) : (
          <div className="cv-list-grid">
            {cvs.map((cv) => {
              const finalPdfUrl = Array.isArray(cv.fileUrls) ? cv.fileUrls[0] : cv.fileUrls;

              return (
                <div className="cv-card" key={cv._id}>
                  {finalPdfUrl ? (
                    <>
                      <div
                        style={{
                          width: "300px",
                          height: "500px",
                          overflow: "hidden",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                        }}
                      >
                        <CVViewer pdfUrl={finalPdfUrl} />
                      </div>

                      <div className="cv-actions">
                        <button
                          className="view-detail-btn"
                          onClick={() => window.open(finalPdfUrl, "_blank")}
                        >
                          Xem chi tiết
                        </button>
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
                                handleDeleteCV(cv._id);
                              }
                            });
                          }}
                        >
                          Xóa CV
                        </button>
                        
                        {/* Nút chỉnh sửa đã cập nhật logic */}
                        <button
                          className="edit-cv-btn"
                          onClick={() => handleEditCV(cv._id)}
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="no-file">Không tìm thấy file CV</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cvs;