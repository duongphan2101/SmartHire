import React, { useEffect, useState } from "react";
import { useTerms } from "../../hook/useTerms";
import Swal from "sweetalert2";
import "./TermsAdmin.css";

const HRterms: React.FC = () => {
  const { termsText, isLoading, isSaving, fetchTerms, updateTerms } = useTerms();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    fetchTerms("hr");
  }, [fetchTerms]);

  const handleEdit = () => {
    setDraft(termsText);
    setIsEditing(true);
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Hủy chỉnh sửa?",
      text: "Các thay đổi chưa lưu sẽ bị mất.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Vẫn hủy",
      cancelButtonText: "Tiếp tục chỉnh sửa",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#10b981",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditing(false);
        setDraft("");
      }
    });
  };

  const handleSave = async () => {
    if (!draft.trim()) {
      Swal.fire({
        icon: "error",
        title: "Nội dung trống!",
        text: "Điều khoản không được để trống.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const result = await updateTerms("hr", draft);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Đã lưu thành công!",
        text: "Điều khoản Nhà tuyển dụng đã được cập nhật.",
        confirmButtonColor: "#10b981",
      });
      setIsEditing(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lưu thất bại!",
        text: result.message || "Đã xảy ra lỗi khi lưu điều khoản.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="terms-admin-container">
      <div className="terms-admin-header">
        <h2>📜 Điều khoản dành cho Nhà tuyển dụng (HR)</h2>
      </div>

      <div className="terms-admin-content">
        {isLoading ? (
          <div className="terms-admin-loading">Đang tải điều khoản...</div>
        ) : isEditing ? (
          <textarea
            className="terms-admin-editor"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        ) : (
          <pre className="terms-admin-text">
            {termsText || "Không tìm thấy nội dung điều khoản HR."}
          </pre>
        )}
      </div>

      <div className="terms-admin-actions">
        {isEditing ? (
          <>
            <button
              className="btn-save"
              onClick={handleSave}
              disabled={isSaving}
            >
               {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
               Hủy
            </button>
          </>
        ) : (
          <button className="btn-edit" onClick={handleEdit}>
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
};

export default HRterms;
