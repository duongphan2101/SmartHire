import React, { useEffect, useState } from "react";
import "./userReport.css";
import { MdClose, MdReport } from "react-icons/md";

interface UserReportProps {
  open: boolean;
  onClose: () => void;
  // optional info you may want to show / send
  jobId?: string;
  jobTitle?: string;
  department?: string;
  userId?: string | null;
  // optional callback when submit (if you later want to handle submit outside)
  onSubmit?: (payload: { title: string; details: string; contact?: string }) => void;
}

const UserReport: React.FC<UserReportProps> = ({
  open,
  onClose,
  jobId,
  jobTitle,
  department,
  userId,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    if (open) {
      // reset form khi mở modal
      setTitle("");
      setDetails("");
      setContact("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation
    if (!title.trim() || !details.trim()) {
      alert("Vui lòng điền cả tiêu đề và nội dung báo cáo.");
      return;
    }

    const payload = {
      jobId,
      jobTitle,
      department,
      userId,
      title: title.trim(),
      details: details.trim(),
      contact: contact.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    // nếu có callback onSubmit thì gọi, nếu không thì chỉ đóng modal
    if (onSubmit) {
      onSubmit(payload);
    } else {
      // hiện thông báo nhỏ rồi đóng (bạn có thể thay bằng Swal nếu muốn)
      alert("Đã gửi báo cáo (demo).");
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
