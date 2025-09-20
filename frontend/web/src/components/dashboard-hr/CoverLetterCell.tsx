import { useState } from "react";
import "./CoverLetterCell.css";

export function CoverLetterCell({ coverLetter }: { coverLetter?: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!coverLetter) return <td>-</td>;

  return (
    <td
      style={{ cursor: "pointer", maxWidth: 200 }} // giới hạn width khi thu gọn
      onClick={() => setExpanded(!expanded)}
    >
      <div className={`cover-letter ${expanded ? "expanded" : ""}`}>
        {coverLetter}
      </div>
    </td>
  );
}
