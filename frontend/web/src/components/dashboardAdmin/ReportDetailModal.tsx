// ReportDetailModal.tsx
import React from "react";
import "./ReportDetailModal.css";

export interface ReportDetail {
  title: string;
  details: string;
  jobId?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  report: ReportDetail | null;
}

const ReportDetailModal: React.FC<Props> = ({ open, onClose, report }) => {
  if (!open || !report) return null;

  return (
    <div className="report-modal-overlay">
      <div className="report-modal">
        <h2 className="report-modal-title">{report.title}</h2>
        <div className="report-modal-body">
          <p>{report.details}</p>
         
        </div>
        <div className="report-modal-footer">
          <button className="btn-close" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
