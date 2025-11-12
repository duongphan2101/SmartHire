import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Slide,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormGroup,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import useCV from "../../hook/useCV";
import useApplication from "../../hook/useApplication";
import useUser from "../../hook/useUser";
import { Switch } from "antd";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} timeout={{ enter: 800, exit: 400 }} />;
});

interface ApplyModalProps {
  _id: string; // Job ID
  jobTitle: string;
  department: string;
  open: boolean;
  onClose: () => void;
  userId: any;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ _id, jobTitle, department, open, onClose, userId }) => {
  const [aiSupport, setAiSupport] = useState<boolean>(false);
  const { loadingCV, errorCV, getCVs, cvs } = useCV();
  const { createApplication, error: appError, loading, generateCoverLetter, coverLetter: coverLetterFromHook } = useApplication();
  const { applyJob } = useUser();
  const [selectedCV, setSelectedCV] = useState<string>("");
  const [coverletter, setCoverletter] = useState<string>(""); // State nội bộ cho TextField
  const [idFromUser, setIdFromUser] = useState<string>("");

  // State cho trường chỉnh sửa AI
  const [refinementPrompt, setRefinementPrompt] = useState<string>("");

  useEffect(() => {
    if (userId && (userId._id || userId.user_id)) {
      const id = userId._id || userId.user_id;
      setIdFromUser(id);
      getCVs(id); // Tải CV của user
    }
  }, [userId, getCVs]);

  const handleSubmit = async () => {
    try {
      // 1. Tạo đơn ứng tuyển
      await createApplication({
        jobId: _id,
        userId: idFromUser,
        resumeId: selectedCV,
        coverLetter: coverletter,
      });

      // 2. Cập nhật trạng thái 'đã ứng tuyển' cho user
      await applyJob(idFromUser, _id);

      // 3. Thông báo thành công
      Swal.fire({
        icon: "success",
        title: "Ứng tuyển thành công",
        text: "Hồ sơ của bạn đã được gửi!",
        timer: 2000,
        showConfirmButton: false,
      });

      // 4. Đóng modal và reset state
      setTimeout(() => {
        onClose();
        setCoverletter("");
        setSelectedCV(cvs.length > 0 ? cvs[0]._id : ""); // Reset về CV đầu tiên
        setAiSupport(false);
        setRefinementPrompt("");
      }, 500);

    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: appError || err.message || "Không thể gửi ứng tuyển",
      });
    }
  };

  // CẬP NHẬT: Chỉ chạy AI nếu bật VÀ chưa có nội dung
  const handleAiToggle = (checked: boolean) => {
    setAiSupport(checked);
    if (checked && !coverletter && selectedCV && _id) { // Thêm điều kiện
      generateCoverLetter({ cvId: selectedCV, jobId: _id });
    }
  };

  // THÊM MỚI: Hàm gọi AI để chỉnh sửa
  const handleRefine = async () => {
    if (!refinementPrompt.trim() || !coverletter) return; // Cần nội dung cũ và chỉ dẫn mới

    // Gọi hook với logic "chỉnh sửa" (từ cvaiController.js)
    await generateCoverLetter({
      previousResult: coverletter,
      refinementPrompt: refinementPrompt
    });

    // Xóa nội dung trường chỉnh sửa sau khi gửi
    setRefinementPrompt("");
  };

  // Tải CV (Loading)
  useEffect(() => {
    if (loadingCV) {
      Swal.fire({
        title: "Đang tải CV...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    } else {
      Swal.close();
    }
  }, [loadingCV]);

  // Lỗi tải CV
  useEffect(() => {
    if (errorCV) {
      Swal.fire({
        icon: "error",
        title: "Lỗi khi tải CV",
        text: errorCV,
      });
    }
  }, [errorCV]);

  // Tự động chọn CV đầu tiên
  useEffect(() => {
    if (cvs.length > 0 && !selectedCV) { // Chỉ đặt nếu chưa chọn
      const firstCV = cvs[0]._id;
      setSelectedCV(firstCV);
    }
  }, [cvs, selectedCV]);

  // Đồng bộ state từ hook vào state nội bộ
  useEffect(() => {
    if (coverLetterFromHook) {
      setCoverletter(coverLetterFromHook);
    }
  }, [coverLetterFromHook]);


  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Ứng tuyển công việc</DialogTitle>

      <DialogContent>
        <p>
          Bạn đang ứng tuyển vào: <b>{jobTitle} - {department}</b>
        </p>

        {loadingCV ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <CircularProgress color="success" />
          </div>
        ) : (
          <>
            <FormGroup>
              {/* Chọn CV */}
              <FormControl fullWidth margin="normal" disabled={loading}>
                <InputLabel id="cv-select-label" color="success">Chọn CV</InputLabel>
                <Select
                  labelId="cv-select-label"
                  value={selectedCV}
                  onChange={(e) => setSelectedCV(e.target.value)}
                  label="Chọn CV"
                  color="success"
                >
                  {cvs.length > 0 ? (
                    cvs.map((cv) => (
                      <MenuItem key={cv._id} value={cv._id}>
                        {cv.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Bạn chưa có CV nào</MenuItem>
                  )}
                </Select>
              </FormControl>

              <div className="w-full flex gap-2.5 items-center mb-2">
                <Switch
                  checked={aiSupport}
                  onChange={handleAiToggle}
                  disabled={loading || !selectedCV}
                  style={{
                    backgroundColor: aiSupport ? '#059669' : undefined,
                  }}
                />
                <span>AI hỗ trợ viết thư giới thiệu</span>
                {/* Spinner khi AI đang chạy */}
                {loading && <CircularProgress size={20} color="success" sx={{ ml: 1 }} />}
              </div>

              {/* Thư giới thiệu (CHÍNH) */}
              <TextField className="coverletter_form"
                label="Thư giới thiệu (có thể có hoặc không)"
                multiline
                rows={aiSupport ? 8 : 10}
                fullWidth
                margin="normal"
                placeholder="Viết lời nhắn hoặc giới thiệu ngắn gọn..."
                color="success"
                value={coverletter}
                onChange={(e) => setCoverletter(e.target.value)}
                InputProps={{
                  readOnly: loading,
                }}
              />

              {/* Khung chỉnh sửa AI */}
              {aiSupport && (
                <div style={{ marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                  <TextField
                    fullWidth
                    label="Yêu cầu AI chỉnh sửa (vd: ngắn gọn hơn, chuyên nghiệp hơn)"
                    value={refinementPrompt}
                    onChange={(e) => setRefinementPrompt(e.target.value)}
                    margin="normal"
                    disabled={loading || !coverletter}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                        borderColor: '#059669',
                      },
                      '& label.Mui-focused': {
                        color: '#059669',
                      },
                    }}
                  />
                  <Button
                    onClick={handleRefine}
                    variant="contained"
                    disabled={loading || !refinementPrompt.trim() || !coverletter}
                    sx={{
                      mt: 1,
                      textTransform: 'none',
                      backgroundColor: '#059669',
                      '&:hover': {
                        backgroundColor: '#047857',
                      },
                    }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? "Đang chỉnh sửa..." : "Chỉnh sửa bằng AI"}
                  </Button>

                </div>
              )}

            </FormGroup>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="success">
          Đóng
        </Button>

        <Button
          onClick={() => {
            if (!selectedCV) {
              Swal.fire({
                icon: "warning",
                title: "Chưa chọn CV",
                text: "Vui lòng chọn 1 CV trước khi gửi.",
              });
              return;
            }
            handleSubmit();
          }}
          variant="contained"
          sx={{
            backgroundColor: "#059669", "&:hover": { backgroundColor: "#047857" },
          }}
          disabled={loading || loadingCV}
        >
          {loading || loadingCV ? <CircularProgress size={24} color="inherit" /> : "Gửi ứng tuyển"}
        </Button>
      </DialogActions>
    </Dialog>
  );

};

export default ApplyModal;