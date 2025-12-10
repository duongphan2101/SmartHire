import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, CircularProgress } from '@mui/material';
import useJob, { type Job } from '../../hook/useJob';
import { useEffect, useState } from 'react';
import useDepartment, { type DepartmentData } from '../../hook/useDepartment';

type pieChartProps = {
    hrId: string;
};

const STATUS_LABELS: Record<string, string> = {
    active: 'Đang tuyển',
    pending: 'Chờ duyệt',
    filled: 'Đã tuyển đủ',
    expired: 'Hết hạn',
    banned: 'Đã khóa',
    unknown: 'Khác'
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'var(--color-blue-500)';
        case 'pending': return 'var(--color-yellow-500)';
        case 'filled': return 'var(--color-emerald-600)';
        case 'expired': return 'var(--color-gray-400)';
        case 'banned': return 'var(--color-red-400)';
        default: return '#0288d1';
    }
};

export default function PieActiveArc({ hrId }: pieChartProps) {
    const { getJobByDepId } = useJob();
    const { getDepartmentByUserId } = useDepartment();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [dep, setDep] = useState<DepartmentData | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch Department
    useEffect(() => {
        if (!hrId) return;
        const fetchDep = async () => {
            const res = await getDepartmentByUserId(hrId);
            if (res) setDep(res);
        };
        fetchDep();
    }, [hrId, getDepartmentByUserId]);

    // Fetch Jobs
    useEffect(() => {
        if (!dep || !dep._id) return;
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await getJobByDepId(dep._id);
                setJobs(res || []);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [dep, getJobByDepId]);


    const safeJobs = Array.isArray(jobs) ? jobs : [];

    const statusCounts = safeJobs.reduce((acc, job) => {
    const status = job.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
    }, {} as Record<string, number>);

    // Map dữ liệu cho biểu đồ
    const chartData = Object.keys(statusCounts).map((status, index) => ({
        id: index,
        label: STATUS_LABELS[status] || status, 
        value: statusCounts[status],
        color: getStatusColor(status)
    }));


    if (loading) return <Box p={2} display="flex" justifyContent="center"><CircularProgress /></Box>;

    return (
        <Box sx={{ backgroundColor: "#fff", borderRadius: 2, p: 2, width: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Thống kê trạng thái công việc {dep ? `(${dep.name})` : ''}
            </Typography>

            {jobs.length > 0 ? (
                <PieChart
                    series={[
                        {
                            data: chartData,
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            valueFormatter: (v) => `${v.value} công việc`,
                            innerRadius: 40,
                            paddingAngle: 3,
                            cornerRadius: 4,
                        },
                    ]}
                    height={250}
                    width={400}
                />
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    Chưa có dữ liệu công việc để hiển thị.
                </Typography>
            )}
        </Box>
    );
}