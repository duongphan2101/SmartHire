import React from 'react';
import {
    Box, Card, CardContent, Typography, Chip,
    List, ListItem, Alert, Button
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';

import useCV from '../../hook/useCV';

interface CVAnalysisPanelProps {
    cvId?: string;
    onStartAnalysis?: () => void;
}

const CVAnalysisPanel: React.FC<CVAnalysisPanelProps> = ({ cvId, onStartAnalysis }) => {
    const { analyzeCV, loadingCV, errorCV, result } = useCV();

    const handleAnalyzeClick = () => {
        if (cvId) {
            onStartAnalysis?.();
            analyzeCV(cvId);
        }
    };

    if (!cvId) {
        return (
            <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                p: 2,
                bgcolor: '#fafafa'
            }}>
                <Typography variant="body1">👈 Chọn một CV để bắt đầu phân tích</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', height: '100%', overflowY: 'auto', p: 2 }}>

            {!result && !loadingCV && (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 80, color: '#059669', mb: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        AI Phân Tích CV Toàn Diện
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Hệ thống phân tích nội dung CV, chỉ ra điểm mạnh – điểm yếu, phần thiếu và mức độ thân thiện ATS.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleAnalyzeClick}
                        sx={{
                            bgcolor: '#059669',
                            borderRadius: '50px',
                            px: 4,
                            py: 1.5,
                            '&:hover': { bgcolor: '#059669' }
                        }}
                    >
                        Phân tích ngay
                    </Button>
                </Box>
            )}

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
                            color: '#059669'
                        }}
                    >
                        Đang phân tích dữ liệu...
                    </Typography>

                    <style>
                        {`
                        @keyframes spin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
                        `}
                    </style>
                </Box>
            )}

            {errorCV && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errorCV}
                    <Button size="small" onClick={handleAnalyzeClick} sx={{ ml: 2 }}>
                        Thử lại
                    </Button>
                </Alert>
            )}

            {/* ==== RESULT ==== */}
            {result && !loadingCV && (
                <div className="animate-fade-in space-y-4 flex flex-col gap-3.5">

                    {/* SUMMARY */}
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                Tổng quan
                            </Typography>
                            <Typography variant="body2">
                                {result.summary}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* STRENGTHS */}
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600}
                                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#2e7d32' }}>
                                <CheckCircleIcon /> Điểm mạnh
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {result.strengths?.map((s, i) => (
                                    <Chip key={i} label={s} sx={{ bgcolor: '#e8f5e9', color: '#1b5e20' }} />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* WEAKNESSES */}
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600}
                                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#4aa8f0' }}>
                                <TrendingUpIcon /> Điểm cần cải thiện
                            </Typography>

                            <List dense>
                                {result.weaknesses?.map((w, i) => (
                                    <ListItem key={i}>• {w}</ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* SUGGESTED SKILLS */}
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600}
                                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#ed6c02' }}>
                                <AutoAwesomeIcon /> Kỹ năng nên bổ sung
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {result.suggested_skills?.map((s, i) => (
                                    <Chip key={i} label={s} sx={{ bgcolor: '#fff3e0', color: '#e65100' }} />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* MISSING SECTIONS */}
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600}
                                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#b91c1c' }}>
                                <AssignmentLateIcon /> Phần còn thiếu
                            </Typography>

                            <List dense>
                                {result.missing_sections?.map((m, i) => (
                                    <ListItem key={i}>• {m}</ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* FORMAT TIPS */}
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, textAlign: 'left' }}>
                                Gợi ý format CV
                            </Typography>

                            <List dense>
                                {result.format_tips?.map((m, i) => (
                                    <ListItem key={i}>• {m}</ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* ATS CHECK */}
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600}
                                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#2563eb' }}>
                                Đánh giá ATS
                            </Typography>

                            <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'left' }}>Vấn đề ATS:</Typography>
                            <List dense>
                                {result.ats_check?.issues?.map((i, idx) => (
                                    <ListItem sx={{ py: .5 }} key={idx}>• {i}</ListItem>
                                ))}
                            </List>

                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, textAlign: 'left' }}>Gợi ý cải thiện ATS:</Typography>
                            <List dense>
                                {result.ats_check?.improvements?.map((i, idx) => (
                                    <ListItem sx={{ py: .5 }} key={idx}>• {i}</ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* ROADMAP */}
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600}
                                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#2563eb' }}>
                                Lộ trình phát triển CV
                            </Typography>
                            <List dense>
                                {result.roadmap?.map((i, idx) => (
                                    <ListItem sx={{ py: .5 }} key={idx}>• {i}</ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button size="small" onClick={handleAnalyzeClick}>
                            Phân tích lại
                        </Button>
                    </Box>
                </div>
            )}
        </Box>
    );
};

export default CVAnalysisPanel;
