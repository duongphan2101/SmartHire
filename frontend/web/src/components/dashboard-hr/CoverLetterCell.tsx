import { useState } from "react";
import DOMPurify from "dompurify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  // Typography,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./CoverLetterCell.css"; // Vẫn dùng để style phần xem trước

export function CoverLetterCell({ coverLetter }: { coverLetter?: string }) {
  const [open, setOpen] = useState(false);

  if (!coverLetter) return <td style={{textAlign: 'center'}}>-</td>;

  const safeContent = DOMPurify.sanitize(coverLetter);

  // Xử lý: Tạo bản xem trước text thuần (bỏ thẻ HTML) để hiện trong bảng cho gọn
  const createPreview = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.substring(0, 50) + (text.length > 50 ? "..." : "");
  };

  const previewText = createPreview(safeContent);

  return (
    <>
      {/* 1. Ô trong bảng (Chỉ hiện preview ngắn gọn) */}
      <td
        style={{ cursor: "pointer", maxWidth: 200, verticalAlign: "middle" }}
        onClick={() => setOpen(true)}
        title="Nhấn để xem toàn bộ thư"
      >
        <div className="cover-letter-preview">
           <span style={{ fontWeight: 500, color: '#1976d2' }}>[Xem chi tiết]</span> 
           <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: 5 }}>
             {previewText}
           </span>
        </div>
      </td>

      {/* 2. Modal hiển thị nội dung đầy đủ */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md" // Độ rộng modal: sm, md, lg
        fullWidth
        scroll="paper" // Cho phép cuộn nội dung nếu thư quá dài
      >
        {/* Tiêu đề Modal */}
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Thư giới thiệu ứng tuyển
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Nội dung thư (HTML) */}
        <DialogContent dividers>
          <div
            className="cover-letter-full-content"
            dangerouslySetInnerHTML={{ __html: safeContent }}
            style={{
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: '#333'
            }}
          />
        </DialogContent>

        {/* Nút đóng */}
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="contained" color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}