import React, { useEffect, useRef, useState } from "react";
import { useTerms } from "../../hook/useTerms";

interface TermsModalProps {
  onClose: () => void;
  onConfirm: (role: string) => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose, onConfirm }) => {
  const [selectedRole, setSelectedRole] = useState<"user" | "hr">("user");
  const [checked, setChecked] = useState(false);

  const { termsText, isLoading, fetchTerms } = useTerms();
  const selectedRoleRef = useRef(selectedRole);

  useEffect(() => {
    selectedRoleRef.current = selectedRole;
    fetchTerms(selectedRole);
    setChecked(false);
  }, [selectedRole, fetchTerms]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "24px",
          width: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          Điều khoản sử dụng
        </h2>

        <p className="text-left text-gray-400">Chọn vai trò của bạn (*)</p>
        <div style={{ display: "flex", gap: "12px", margin: "8px 0 16px" }}>
          <button
            onClick={() => setSelectedRole("user")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: selectedRole === "user" ? "#2563eb" : "#e5e7eb",
              color: selectedRole === "user" ? "#fff" : "#000",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
            }}
          >
            Ứng viên
          </button>
          <button
            onClick={() => setSelectedRole("hr")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: selectedRole === "hr" ? "#10b981" : "#e5e7eb",
              color: selectedRole === "hr" ? "#fff" : "#000",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
            }}
          >
            Nhà tuyển dụng
          </button>
        </div>

        <pre
          style={{
            background: "#f3f4f6",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "14px",
            whiteSpace: "pre-wrap",
            textAlign: "justify",
            minHeight: "150px",
            color: isLoading ? "#6b7280" : "#000",
          }}
        >
          {isLoading ? "Đang tải nội dung..." : termsText}
        </pre>

        <div style={{ marginTop: 20, display: "flex", gap: "8px", alignItems: "center" }}>
          <span>Tôi đồng ý với các điều khoản</span>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            disabled={isLoading}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            style={{
              padding: "8px 16px",
              background: "#9ca3af",
              color: "white",
              borderRadius: "6px",
              marginRight: "8px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            style={{
              padding: "8px 16px",
              background: checked && !isLoading ? "#16a34a" : "#9ca3af",
              color: "white",
              borderRadius: "6px",
              cursor: checked && !isLoading ? "pointer" : "not-allowed",
            }}
            onClick={() => onConfirm(selectedRoleRef.current)}
            disabled={!checked || isLoading}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
