import Header from "../../components/Header/Header";
import ChatWithAI from "../../components/Chat-With-AI/ChatWithAI";
import Footer from "../../components/Footer/Footer";
import "./Intro.css";
// import healcare from "../../assets/images/healcare.jpg";
import logo from "../../assets/images/logo_v1.png";
import type { ChatRoom } from "../../utils/interfaces";
import { useState } from "react";
import ChatModal from "../../components/Chat/Chat";

const Intro = () => {
  const title = "SMART HIRE";
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
      <div className="intro-container">
        <div className="intro-content">
          <div className="intro-text">
            <h1 className="intro-title">
              {title.split("").map((char, index) => (
                <span key={index}>{char}</span>
              ))}
            </h1>
            <p>
              <b style={{ fontSize: "1.5rem" }}>SmartHire</b> không chỉ đơn thuần là một nền tảng tuyển dụng, mà
              còn là cầu nối giúp rút ngắn khoảng cách giữa người tìm việc và
              việc tìm người.
            </p>

            <p>
              Dự án hướng tới việc xây dựng một{" "}
              <b>môi trường tuyển dụng minh bạch</b>, nơi thông tin được trình
              bày rõ ràng, quy trình ứng tuyển đơn giản và{" "}
              <b>trải nghiệm người dùng</b> được đặt lên hàng đầu.
            </p>

            <p>
              Với định hướng tập trung vào <b>sinh viên</b> và{" "}
              <b>người mới tốt nghiệp</b> – nhóm đối tượng thường gặp khó khăn
              trong việc tiếp cận cơ hội nghề nghiệp phù hợp – <b>SmartHire</b>{" "}
              mong muốn trở thành <b>người đồng hành tin cậy</b>, giúp họ không chỉ tìm việc mà còn{" "}
              <b>định hướng sự nghiệp lâu dài</b>.
            </p>

            <p>
              Đồng thời, nền tảng cũng mang lại lợi ích cho <b>doanh nghiệp</b>{" "}
              bằng việc cung cấp <b>công cụ quản lý tuyển dụng trực quan</b>, giúp tiết kiệm{" "}
              <b>thời gian</b> và <b>chi phí</b>.
            </p>
          </div>

          <div className="intro-image">
            <img src={logo} alt="healcare" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Intro;
