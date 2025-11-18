import React, { useEffect } from 'react';
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

interface CVAnalysisPanelProps {
    cvId?: string;
}

const CVAnalysisPanel: React.FC<CVAnalysisPanelProps> = ({ cvId }) => {
    const { analyzeCV, loadingCV, errorCV, result } = useCV();

    useEffect(() => {
        if (cvId) {
            analyzeCV(cvId);
        }
    }, [cvId, analyzeCV]);

    const handleAnalyzeClick = () => {
        if (cvId) analyzeCV(cvId);
    };

    if (!cvId) {
        return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', border: '1px dashed #ddd', borderRadius: 2 }}>
                <Typography>Vui lòng chọn CV bên trái để phân tích</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', height: '100%', overflowY: 'auto', p: 2 }}>

            {/* Màn hình chờ hoặc nút bấm ban đầu */}
            {!result && !loadingCV && (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 60, color: '#059669', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>AI Phân Tích Hồ Sơ</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Nhận đánh giá chi tiết về điểm mạnh, điểm yếu và lộ trình phát triển sự nghiệp từ AI.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleAnalyzeClick}
                        startIcon={<AutoAwesomeIcon />}
                        sx={{ bgcolor: '#9c27b0', '&:hover': { bgcolor: '#059669' } }}
                    >
                        Phân tích ngay
                    </Button>
                </Box>
            )}

            {/* Loading Bar */}
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
                        AI đang đọc CV của bạn...
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
            )}


            {/* Error Message */}
            {errorCV && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errorCV}
                    <Button size="small" onClick={handleAnalyzeClick} sx={{ ml: 2 }}>Thử lại</Button>
                </Alert>
            )}

            {/* KẾT QUẢ PHÂN TÍCH */}
            {result && (
                <div className="animate-fade-in space-y-4 flex flex-col gap-3.5">

                    {/* 1. Điểm số & Tóm tắt */}
                    <Card sx={{ bgcolor: '#f3e5f5', border: 'none', boxShadow: 'none' }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                                Mức độ phù hợp thị trường
                            </Typography>
                            <Typography variant="h2" sx={{ color: '#7b1fa2', fontWeight: 'bold', my: 1 }}>
                                {result.job_match_score}<span style={{ fontSize: '20px' }}>/100</span>
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>
                                "{result.summary}"
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* 2. Điểm mạnh */}
                    <Card sx={{ border: 'none', boxShadow: 'none' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#2e7d32' }}>
                                <CheckCircleIcon /> Điểm mạnh
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {result.strengths.map((str, index) => (
                                    <Chip key={index} label={str} sx={{
                                        bgcolor: '#e8f5e9', color: '#1b5e20', fontWeight: 500, whiteSpace: 'normal',
                                        height: 'auto',
                                        wordBreak: 'break-word'
                                    }} />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* 3. Cần cải thiện */}
                    <Card sx={{ border: 'none', boxShadow: 'none' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#ed6c02' }}>
                                <TrendingUpIcon /> Kỹ năng nên học
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {result.suggested_skills.map((skill, index) => (
                                    <Chip key={index} label={skill} sx={{
                                        bgcolor: '#fff3e0', color: '#e65100', fontWeight: 500, whiteSpace: 'normal',
                                        height: 'auto',
                                        wordBreak: 'break-word'
                                    }} />
                                ))}
                            </Box>

                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Điểm yếu cần khắc phục:</Typography>
                            <ul style={{ paddingLeft: '20px', margin: 0, color: '#666' }}>
                                {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* 4. Lộ trình */}
                    <Card sx={{ border: 'none', boxShadow: 'none' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                <SchoolIcon /> Lộ trình gợi ý
                            </Typography>
                            <List dense>
                                {result.roadmap.map((step, index) => (
                                    <ListItem key={index} alignItems="flex-start" disableGutters>
                                        <ListItemIcon sx={{ minWidth: 35, mt: 0.5 }}>
                                            <Box sx={{
                                                width: 24, height: 24, borderRadius: '50%',
                                                bgcolor: '#e3f2fd', color: '#1976d2',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 'bold', fontSize: '12px'
                                            }}>
                                                {index + 1}
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText primary={step} primaryTypographyProps={{ fontSize: '0.95rem' }} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Box>
    );
};

export default CVAnalysisPanel;