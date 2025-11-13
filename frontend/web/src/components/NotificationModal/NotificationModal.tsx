import React, { useEffect, useState } from "react";
import "./NotificationModal.css";
import useNotification, { type Notification } from "../../hook/useNotification";
import { useChat } from "../../hook/useChat";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { ChatRequest, Interview } from "../../utils/interfaces";
import useInterview from "../../hook/useInterview";
import dayjs from "dayjs";
import useUser from "../../hook/useUser";

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
}) => {
  if (!notification) return null;

  const { acceptChatRequest, rejectChatRequest, getChatRequestbyId } = useChat();
  const { fetchInterviewById, updateInterview } = useInterview();
  const MySwal = withReactContent(Swal);
  const [requestData, setRequestData] = useState<ChatRequest>();
  const [interviewInviteData, setInterviewInviteData] = useState<Interview>();
  const { createNotification } = useNotification();
  const { getUser, user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getChatRequestbyId(notification.requestId);
      setRequestData(data);
      const interviewData = await fetchInterviewById(notification.requestId);
      setInterviewInviteData(interviewData);
      getUser(interviewData?.candidateId as string);
    };
    fetchData();
  }, [notification.requestId]);

  const handleAccept = async () => {
    try {
      await acceptChatRequest(notification.requestId);
      MySwal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã chấp nhận lời mời, giờ bạn và nhà tuyển dụng có thể trò chuyện với nhau!",
        timer: 2000
      });

      const candidate = await getUser(requestData?.candidateId as string);

      if (candidate) {
        await createNotification({
          receiverId: requestData?.hrId as string,
          type: "INFO",
          title: "Thông báo",
          message: `Ứng viên ${candidate.fullname} đã chấp nhận lời mời trao đổi về công việc!`,
          requestId: ""
        });
      }
      onClose();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi chấp nhận lời mời!",
        timer: 2000
      });
    }
  };

  const handleReject = async () => {
    try {
      await rejectChatRequest(notification.requestId);
      MySwal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã từ chối lời mời!",
        timer: 2000
      });
      const candidate = await getUser(requestData?.candidateId as string);

      if (candidate) {
        await createNotification({
          receiverId: requestData?.hrId as string,
          type: "INFO",
          title: "Thông báo",
          message: `Ứng viên ${candidate.fullname} đã từ chối lời mời trao đổi về công việc!`,
          requestId: ""
        });
      }
      onClose();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi từ chối lời mời!",
        timer: 2000
      });
    }
  };

  const handleAcceptInterviewInvite = async () => {
    if (!interviewInviteData?._id) return;
    const result = await updateInterview(interviewInviteData._id, { status: "confirmed" });

    if (result) {
      MySwal.fire({
        target: ".notification-overlay",
        icon: "success",
        title: "Thành công",
        text: "Đã chấp nhận lời mời, giờ bạn và nhà tuyển dụng có thể trò chuyện với nhau!",
      });

      await createNotification({
        receiverId: interviewInviteData.hrId,
        type: "INFO",
        title: "Thông báo",
        message: `Ứng viên ${user?.fullname} xác nhận sẽ tham gia phỏng vấn`,
        requestId: ""
      });
    }
  };

  const handleRejectInterviewInvite = async () => {
    if (!interviewInviteData?._id) return;

    const confirmResult = await MySwal.fire({
      target: ".notification-overlay",
      title: "Bạn có chắc chắn muốn từ chối?",
      text: "Hành động này sẽ hủy lịch phỏng vấn và không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Vâng, từ chối",
      cancelButtonText: "Hủy bỏ",
    });

    if (confirmResult.isConfirmed) {
      const result = await updateInterview(interviewInviteData._id, { status: "rejected" });

      if (result) {
        MySwal.fire({
          icon: "success",
          title: "Đã từ chối",
          text: "Bạn đã từ chối lời mời phỏng vấn này.",
        });
        await createNotification({
          receiverId: interviewInviteData.hrId,
          type: "INFO",
          title: "Thông báo",
          message: `Ứng viên ${user?.fullname} đã từ chối tham gia phỏng vấn`,
          requestId: ""
        });
      }
    }
  };

  return (
    <div className="notification-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="notification-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="notification-title">{notification.title}</h3>
        <p className="notification-message text-black">{notification.message}</p>
        {notification.type === "INTERVIEW_INVITE" && (
          <div>
            <p className="notification-message text-black">
              <strong>{interviewInviteData?.mode === "offline" ? "OFFLINE" : "ONLINE"}</strong> tại <strong>{interviewInviteData?.location}</strong>
            </p>
            <p className="notification-message text-black">
              vào lúc <strong>{interviewInviteData?.scheduledAt
                ? dayjs(interviewInviteData.scheduledAt).format('DD/MM/YYYY HH:mm')
                : ''}
              </strong>
            </p>
          </div>
        )}
        <small className="notification-time text-right">
          {new Date(notification.createdAt).toLocaleString("vi-VN")}
        </small>

        {notification.type === "CHAT_REQUEST" && requestData?.status == "pending" && (
          <div className="flex items-center justify-center gap-8" style={{ marginTop: 10 }}>
            <button onClick={handleAccept} className="notify-modal-btn notify-modal-btn_accept">Chấp nhận</button>
            <button onClick={handleReject} className="notify-modal-btn notify-modal-btn_inject">Từ chối</button>
          </div>
        )}

        {notification.type === "INTERVIEW_INVITE" && interviewInviteData?.status == "pending" && (
          <div className="flex items-center justify-center gap-8" style={{ marginTop: 10 }}>
            <button onClick={handleAcceptInterviewInvite} className="notify-modal-btn notify-modal-btn_accept">Chấp nhận</button>
            <button onClick={handleRejectInterviewInvite} className="notify-modal-btn notify-modal-btn_inject">Từ chối</button>
          </div>
        )}

        <div className="notification-footer">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
