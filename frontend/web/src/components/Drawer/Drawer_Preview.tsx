import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Swal from 'sweetalert2';

import useCV from '../../hook/useCV';
import type { CVData } from '../../utils/interfaces';
import FreshInternCVPreview from './Template_Preview';

export interface CustomSettings {
    color: string;
    fontFamily: string;
    lang: string;
}

const PRESET_COLORS = [
    '#059669', '#2563eb', '#db2777', '#dc2626',
    '#d97706', '#7c3aed', '#000000'
];

const DEFAULT_LAYOUT = ['SUMMARY', 'EXPERIENCE', 'PROJECTS', 'EDUCATION', 'SKILLS', 'ACTIVITIES'];

interface Props {
    open: boolean;
    onClose: () => void;
    cvId: string;
    jobId: string;
    onRefine?: (data: CVData) => void;
    userId: string;
}

export default function Drawer_Preview({
    open,
    onClose,
    cvId,
    jobId,
    onRefine,
    userId
}: Props) {

    const { generateCV, refineCV, createCV } = useCV();

    const [feedback, setFeedback] = useState("");
    const [dataCVTailor, setDataCVTailor] = useState<CVData | null>(null);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [selectedColor, setSelectedColor] = useState('#059669');
    const [selectedLang, setSelectedLang] = useState('vi');

    useEffect(() => {
        const fetchData = async () => {
            if (!open || !cvId || !jobId) return;

            setIsFetchingData(true);
            try {
                const res = await generateCV(cvId, jobId);
                setDataCVTailor(res);

                if (res?.color) setSelectedColor(res.color);
                if (res?.languageForCV) setSelectedLang(res.languageForCV);
            } catch (error) {
                console.error("Error fetching CV preview:", error);
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchData();
        console.log("IDUSER: ", userId);
    }, [open, cvId, jobId]);

    useEffect(() => {
        if (!open) {
            setFeedback("");
            setSelectedColor('#059669');
            setSelectedLang('vi');
            setIsSaving(false);
            setIsRefining(false);
        }
    }, [open]);

    const handleLangChange = (e: SelectChangeEvent) => {
        setSelectedLang(e.target.value);
    };

    const handleRefine = async () => {
        if (!feedback.trim() || !dataCVTailor) return;

        setIsRefining(true);
        try {
            const res = await refineCV(dataCVTailor, feedback);
            setDataCVTailor(res);

            if (res.color) setSelectedColor(res.color);
            if (res.languageForCV) setSelectedLang(res.languageForCV);

            if (onRefine) onRefine(res);
            setFeedback("");
        } catch (error) {
            console.error("Refine error:", error);
            Swal.fire("Lỗi", "Không thể chỉnh sửa CV bằng AI lúc này.", "error");
        } finally {
            setIsRefining(false);
        }
    };

    const handleConfirm = async () => {
        if (!dataCVTailor) return;
        if (!userId) {
            Swal.fire("Lỗi", "Không tìm thấy thông tin người dùng", "error");
            return;
        }

        setIsSaving(true);

        try {
            const settings: CustomSettings = {
                color: selectedColor,
                lang: selectedLang,
                fontFamily: dataCVTailor.fontFamily || 'Arial'
            };

            const dataToSave = {
                ...dataCVTailor,
                color: selectedColor,
                languageForCV: selectedLang
            };

            await createCV(
                userId,
                dataToSave,
                settings,
                DEFAULT_LAYOUT
            );

            Swal.fire({
                icon: 'success',
                title: 'Đã lưu CV',
                text: 'CV tùy chỉnh đã được thêm vào hồ sơ của bạn.',
                timer: 1500,
                showConfirmButton: false
            });

            onClose();

        } catch (error: any) {
            console.error("Save CV error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Lưu thất bại',
                text: error.message || "Có lỗi xảy ra khi lưu CV.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{ zIndex: 9999999999 }}
            PaperProps={{
                sx: { width: '70vw', padding: 0, overflow: 'hidden' },
                disableEnforceFocus: true,
                disableAutoFocus: true,
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa' }}>

                <Box sx={{
                    p: 2,
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600}>Màu sắc:</Typography>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {PRESET_COLORS.map(color => (
                                <div
                                    key={color}
                                    onClick={() => !isFetchingData && setSelectedColor(color)}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        backgroundColor: color,
                                        cursor: isFetchingData ? 'default' : 'pointer',
                                        border: selectedColor === color ? "2px solid #ccc" : "2px solid transparent",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {selectedColor === color && <CheckCircleIcon sx={{ color: '#fff', fontSize: 18 }} />}
                                </div>
                            ))}
                        </div>
                    </Box>

                    <Box sx={{ minWidth: 120 }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="lang-select-label">Ngôn ngữ</InputLabel>
                            <Select
                                labelId="lang-select-label"
                                value={selectedLang}
                                label="Ngôn ngữ"
                                onChange={handleLangChange}
                                disabled={isFetchingData}
                                sx={{ borderRadius: 2, backgroundColor: '#f9fafb' }}
                                MenuProps={{ disablePortal: true }}
                            >
                                <MenuItem value="vi">Tiếng Việt 🇻🇳</MenuItem>
                                <MenuItem value="en">English 🇺🇸</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                    backgroundColor: '#e5e7eb'
                }}>
                    {(isFetchingData || !dataCVTailor) ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            flexDirection: 'column',
                            gap: 10
                        }}>
                            <CircularProgress color="success" />
                            <Typography variant="body2">Đang tạo bản xem trước...</Typography>
                        </div>
                    ) : (
                        <div style={{ maxWidth: "210mm", margin: "0 auto", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                            <FreshInternCVPreview
                                cvData={dataCVTailor}
                                color={selectedColor}
                                language={selectedLang}
                            />
                        </div>
                    )}
                </Box>

                <Box sx={{ p: 2, backgroundColor: '#fff', borderTop: '1px solid #ddd' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: "flex", gap: 1 }}>
                        <AutoAwesomeIcon fontSize="small" color="success" />
                        Yêu cầu AI chỉnh sửa:
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Ví dụ: Làm phần kỹ năng mạnh hơn, viết lại kinh nghiệm ngắn gọn hơn..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        disabled={isFetchingData || isRefining}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                        <Button
                            onClick={handleRefine}
                            disabled={!feedback.trim() || isRefining}
                            variant="outlined"
                            color="success"
                            startIcon={isRefining ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                            sx={{ borderRadius: 2, textTransform: "none" }}
                        >
                            {isRefining ? "Đang xử lý..." : "Yêu cầu AI sửa lại"}
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ p: 2, display: 'flex', gap: 1.5, justifyContent: 'flex-end', backgroundColor: '#f4f4f5' }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        disabled={isSaving}
                        sx={{ borderRadius: 2, textTransform: "none", borderColor: '#ddd', backgroundColor: '#fff', color: '#333' }}
                    >
                        Hủy bỏ
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleConfirm}
                        disabled={!dataCVTailor || isFetchingData || isRefining || isSaving}
                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            backgroundColor: '#059669',
                            '&:hover': { backgroundColor: '#047857' },
                            minWidth: '140px'
                        }}
                    >
                        {isSaving ? "Đang lưu..." : "Dùng CV này"}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}