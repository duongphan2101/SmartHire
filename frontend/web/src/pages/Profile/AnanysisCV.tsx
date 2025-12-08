import React from 'react'; // Bỏ useEffect vì không dùng nữa
import {
    Box, Card, CardContent, Typography, Chip,
    List, ListItem, ListItemIcon, ListItemText,
    Alert, Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import useCV from '../../hook/useCV';
// import AILoading from './AILoading';

interface CVAnalysisPanelProps {
    cvId?: string;
    // Thêm prop này để báo cho component cha biết lúc nào bắt đầu phân tích
    // để component cha set lại layout (width 40% - 60%)
    onStartAnalysis?: () => void;
}

const CVAnalysisPanel: React.FC<CVAnalysisPanelProps> = ({ cvId, onStartAnalysis }) => {
    // Lưu ý: Đảm bảo hook useCV có cơ chế reset result khi đổi cvId
    // Hoặc bạn có thể tự quản lý state hiển thị ở đây nếu cần.
    const { analyzeCV, loadingCV, errorCV, result } = useCV();

    // XỬ LÝ SỰ KIỆN CLICK NÚT PHÂN TÍCH
    const handleAnalyzeClick = () => {
        if (cvId) {
            // 1. Báo cho cha biết để chia lại layout (40% List - 60% Panel)
            if (onStartAnalysis) {
                onStartAnalysis();
            }
            // 2. Gọi API phân tích
            analyzeCV(cvId);
        }
    };

    // Nếu chưa chọn CV nào từ danh sách
    if (!cvId) {
        return (
            <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                p: 2,
                bgcolor: '#fafafa' // Thêm background nhẹ cho dễ nhìn
            }}>
                <Typography variant="body1">👈 Vui lòng chọn một CV để xem chi tiết</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', height: '100%', overflowY: 'auto', p: 2 }}>

            {/* TRẠNG THÁI 1: CHỜ BẤM NÚT (INTRO) */}
            {/* Hiển thị khi chưa có kết quả VÀ chưa đang load */}
            {!result && !loadingCV && (
                <Box sx={{
                    textAlign: 'center',
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <AutoAwesomeIcon sx={{ fontSize: 80, color: '#059669', mb: 2, opacity: 0.8 }} />
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        AI Phân Tích Hồ Sơ
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '500px' }}>
                        Bấm nút bên dưới để AI quét toàn bộ CV, chấm điểm độ phù hợp và đề xuất lộ trình cải thiện kỹ năng cho bạn.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleAnalyzeClick}
                        startIcon={<AutoAwesomeIcon />}
                        sx={{
                            bgcolor: '#059669',
                            py: 1.5,
                            px: 4,
                            fontSize: '1.1rem',
                            borderRadius: '50px',
                            boxShadow: '0 8px 16px rgba(156, 39, 176, 0.2)',
                            '&:hover': {
                                bgcolor: '#059669',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s'
                            }
                        }}
                    >
                        Phân tích ngay
                    </Button>
                </Box>
            )}

            {/* TRẠNG THÁI 2: ĐANG LOADING */}
            {loadingCV && (
                    <Box sx={{
                        width: '100%',
                        mt: 10,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                border: '4px solid #059669',
                                borderTopColor: 'transparent',
                                animation: 'spin 1s linear infinite'
                            }}
                        />

                        <Typography
                            sx={{
                                mt: 1,
                                fontStyle: 'italic',
                                color: '#059669',
                                animation: 'pulse 1.4s ease-in-out infinite'
                            }}
                        >
                            Đang phân tích dữ liệu...
                        </Typography>

                        <style>
                            {`
                    @keyframes spin {
                        0% { transform: rotate(0); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes pulse {
                        0% { opacity: 0.5; }
                        50% { opacity: 1; }
                        100% { opacity: 0.5; }
                    }
                `}
                        </style>
                    </Box>
                // <div className='flex items-center justify-center' style={{marginTop: 20}}>
                //     <AILoading />
                // </div>
            )}


            {/* TRẠNG THÁI 3: CÓ LỖI */}
            {errorCV && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errorCV}
                    <Button size="small" onClick={handleAnalyzeClick} sx={{ ml: 2, fontWeight: 'bold' }}>Thử lại</Button>
                </Alert>
            )}

            {/* TRẠNG THÁI 4: HIỂN THỊ KẾT QUẢ */}
            {result && !loadingCV && (
                <div className="animate-fade-in space-y-4 flex flex-col gap-3.5">

                    {/* Header kết quả */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">Kết quả phân tích</Typography>
                        <Chip label="Hoàn tất" color="success" size="small" variant="outlined" />
                    </Box>

                    {/* 2. Điểm mạnh */}
                    <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#2e7d32', fontWeight: 600 }}>
                                <CheckCircleIcon /> Điểm mạnh nổi bật
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {result.strengths.map((str, index) => (
                                    <Chip key={index} label={str} sx={{
                                        bgcolor: '#e8f5e9', color: '#1b5e20', fontWeight: 500, whiteSpace: 'normal',
                                        height: 'auto', py: 0.5,
                                        wordBreak: 'break-word'
                                    }} />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* 3. Cần cải thiện */}
                    <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#ed6c02', fontWeight: 600 }}>
                                <TrendingUpIcon /> Kỹ năng nên bổ sung
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {result.suggested_skills.map((skill, index) => (
                                    <Chip key={index} label={skill} sx={{
                                        bgcolor: '#fff3e0', color: '#e65100', fontWeight: 500, whiteSpace: 'normal',
                                        height: 'auto', py: 0.5,
                                        wordBreak: 'break-word'
                                    }} />
                                ))}
                            </Box>

                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#444' }}>Vấn đề cần khắc phục:</Typography>
                            <ul style={{ paddingLeft: '20px', margin: 0, color: '#666' }}>
                                {result.weaknesses.map((w, i) => <li key={i} style={{ marginBottom: '4px' }}>{w}</li>)}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* 4. Lộ trình */}
                    <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2', fontWeight: 600 }}>
                                <SchoolIcon /> Lộ trình gợi ý
                            </Typography>
                            <List dense>
                                {result.roadmap.map((step, index) => (
                                    <ListItem key={index} alignItems="flex-start" disableGutters sx={{ py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40, mt: 0 }}>
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: '50%',
                                                bgcolor: '#e3f2fd', color: '#1976d2',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 'bold', fontSize: '13px'
                                            }}>
                                                {index + 1}
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={step}
                                            primaryTypographyProps={{ fontSize: '0.95rem', color: '#333' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Nút reset/phân tích lại nếu cần */}
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button size="small" color="inherit" onClick={handleAnalyzeClick}>
                            Phân tích lại
                        </Button>
                    </Box>
                </div>
            )}
        </Box>
    );
};

export default CVAnalysisPanel;