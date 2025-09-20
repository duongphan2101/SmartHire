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
  Switch,
  FormControlLabel,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import useCV from "../../hook/useCV";
import useApplication from "../../hook/useApplication";
import useUser from "../../hook/useUser";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} timeout={{ enter: 800, exit: 400 }} />;
});

interface ApplyModalProps {
  _id: string;
  jobTitle: string;
  department: string;
  open: boolean;
  onClose: () => void;
  userId: any;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ _id, jobTitle, department, open, onClose, userId }) => {
  const [aiSupport, setAiSupport] = React.useState(false);
  const { loadingCV, errorCV, getCVs, cvs } = useCV();
  const { createApplication, error } = useApplication();
  const { applyJob } = useUser();
  const [selectedCV, setSelectedCV] = useState<string>("");
  const [coverletter, setCoverletter] = useState<string>("");
  const [idFromUser, setIdFromUser] = useState<string>("");

  useEffect(() => {
    if (userId && (userId._id || userId.user_id)) {
      const id = userId._id || userId.user_id;
      setIdFromUser(id);
      getCVs(id);
    }
  }, [userId, getCVs]);

  const handleSubmit = async () => {
    try {
      await createApplication({
        jobId: _id,
        userId: idFromUser,
        resumeId: selectedCV,
        coverLetter: coverletter,
      });

      await applyJob(idFromUser, _id)

      Swal.fire({
        icon: "success",
        title: "Ứng tuyển thành công",
        text: "Hồ sơ của bạn đã được gửi!",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => { onClose(), setCoverletter(""), setSelectedCV("") }, 1500);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error || "Không thể gửi ứng tuyển",
      });
    }
  };

  const handleAiToggle = (checked: boolean) => {
    setAiSupport(checked);

    Swal.fire({
      icon: checked ? "info" : "warning",
      title: checked ? "Đã bật AI hỗ trợ" : "Đã tắt AI hỗ trợ",
      text: checked
        ? "AI sẽ giúp bạn viết thư giới thiệu."
        : "Bạn sẽ tự viết thư giới thiệu.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

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

  useEffect(() => {
    if (errorCV) {
      Swal.fire({
        icon: "error",
        title: "Lỗi khi tải CV",
        text: errorCV,
      });
    }
  }, [errorCV]);


  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Ứng tuyển công việc</DialogTitle>

      <DialogContent>
        <p>
          Bạn đang ứng tuyển vào: <b>{jobTitle} - {department} - {_id}</b>
        </p>

        {loadingCV ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <CircularProgress color="success" />
          </div>
        ) : (
          <>
            {/* Chọn CV */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="cv-select-label" color="success">Chọn CV</InputLabel>
              <Select
                labelId="cv-select-label"
                value={selectedCV}
                onChange={(e) => setSelectedCV(e.target.value)}
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

            {/* Switch bật AI */}
            <FormControlLabel
              sx={{ position: "relative" }}
              control={
                <Switch
                  checked={aiSupport}
                  onChange={(e) => handleAiToggle(e.target.checked)}
                  color="success"
                />
              }
              label="AI hỗ trợ viết thư giới thiệu"
            />

            {/* Thư giới thiệu */}
            <TextField
              label="Thư giới thiệu (có thể có hoặc không)"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              placeholder="Viết lời nhắn hoặc giới thiệu ngắn gọn..."
              color="success"
              value={coverletter}
              onChange={(e) => setCoverletter(e.target.value)}
            />
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
              setTimeout(() => {
                onClose();
              }, 500);
              return;
            }
            handleSubmit();
          }}
          variant="contained"
          sx={{
            backgroundColor: "#059669",
            "&:hover": { backgroundColor: "#047857" },
          }}
        >
          Gửi ứng tuyển
        </Button>
      </DialogActions>
    </Dialog>
  );

};

export default ApplyModal;
