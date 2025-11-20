import React, { useEffect, useState } from "react";
import "./userReport.css";
import { MdClose, MdReport } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import { HOSTS } from "../../utils/host";

interface UserReportProps {
  open: boolean;
  onClose: () => void;
  jobId?: string;
  jobTitle?: string;
  department?: string;
  userId?: string | null;
  onSubmit?: (payload: { title: string; details: string; contact?: string }) => void;
}

const UserReport: React.FC<UserReportProps> = ({
  open,
  onClose,
  jobId,
  jobTitle,
  department,
  userId
}) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setDetails("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !details.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu dữ liệu",
        text: "Vui lòng điền cả tiêu đề và nội dung báo cáo.",
      });
      return;
    }

    const payload = {
      jobId,
      jobTitle,
      department,
      userId,
      title: title.trim(),
      details: details.trim(),
    };

    try {
      await axios.post(`${HOSTS.reportService}/`, payload);
      Swal.fire({
        icon: "success",
        title: "Gửi báo cáo thành công",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gửi báo cáo thất bại",
        text: "Vui lòng thử lại sau.",
      });
    }

    onClose();
  };

  return (
    <div className="ur-overlay" role="dialog" aria-modal="true">
      <div className="ur-modal" role="document">
        <div className="ur-header">
          <div className="ur-title">
            <MdReport className="ur-icon" />
            <span>Báo cáo bài đăng</span>
          </div>
          <button className="ur-close" onClick={onClose} aria-label="Đóng">
            <MdClose size={20} />
          </button>
        </div>

        <form className="ur-form" onSubmit={handleSubmit}>
          <div className="ur-field">
            <label>Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Tin tuyển dụng giả mạo"
              maxLength={120}
              required
            />
          </div>

          <div className="ur-field">
            <label>Thông tin chi tiết</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              placeholder="Mô tả lý do bạn báo cáo"
              required
            />
          </div>

          <div className="ur-actions">
            <button type="button" className="ur-btn ur-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="ur-btn ur-submit">
              Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserReport;
