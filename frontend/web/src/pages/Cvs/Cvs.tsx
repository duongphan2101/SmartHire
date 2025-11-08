import React, { useEffect, useState } from "react";
import useUser from "../../hook/useUser";
import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";
import Swal from "sweetalert2";
import "./Cvs.css";
import type { ChatRoom } from "../../utils/interfaces";
import ChatModal from "../../components/Chat/Chat";

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

  const handleDeleteCV = async (cvId: string) => {
    try {
      const res = await fetch(`http://localhost:2222/api/cvs/${cvId}`, {
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
  const [openChat, setIsChatOpen] = useState(false);
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null);
  const handleOpenChatRequest = (room?: ChatRoom) => {
    if (room) {
      setCurrentChatRoom(room);
    }
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };
  return (
    <div className="App">
      <Header onOpenChat={handleOpenChatRequest} />

      {openChat && (
        <ChatModal room={currentChatRoom} onClose={handleCloseChat} />
      )}
      <ChatWithAI />

      <div className="cvs-container">
        <h2 className="cvs-title">CV đã tạo trên SmartHire</h2>
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
                      <button
                        className="view-detail-btn"
                        onClick={() => window.open(cv.fileUrls, "_blank")}
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
