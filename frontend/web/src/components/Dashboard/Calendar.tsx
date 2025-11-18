import React, { useEffect, useState } from 'react';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar, Spin } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import useInterview from '../../hook/useInterview';
import type { Interview } from '../../utils/interfaces';
import useJob from '../../hook/useJob';
import useUser from '../../hook/useUser';

interface EnrichedInterview extends Interview {
    jobTitleDisplay?: string;
    candidateNameDisplay?: string;
}

const Calendar_Das: React.FC = () => {
    const { fetchAllInterviews } = useInterview();
    const { getJobById } = useJob();
    const { getUser } = useUser();

    const [interviewList, setInterviewList] = useState<EnrichedInterview[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getBadgeStatus = (status: string): BadgeProps['status'] => {
        switch (status?.toLowerCase()) {
            // 1. Màu Xanh Lá (Success) 🟢
            // Ý nghĩa: Đã xong và thành công
            case 'completed':
                return 'success';

            // 2. Màu Xanh Dương (Processing) 🔵
            // Ý nghĩa: Đã xác nhận lịch, sắp diễn ra (đang trong tiến trình)
            case 'confirmed':
                return 'processing';

            // 3. Màu Vàng (Warning) 🟠
            // Ý nghĩa: Đang chờ xử lý, chưa chốt lịch (cần chú ý)
            case 'pending':
                return 'warning';

            // 4. Màu Đỏ (Error) 🔴
            // Ý nghĩa: Thất bại hoặc bị từ chối (Kết quả tiêu cực)
            case 'rejected':
            case 'failed':
                return 'error';

            // 5. Màu Xám (Default) ⚪
            // Ý nghĩa: Các trạng thái lạ hoặc không xác định
            default:
                return 'default';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchAllInterviews();
                const rawInterviews = data ?? [];

                const enrichedData = await Promise.all(rawInterviews.map(async (item) => {
                    let jobName = 'Unknown';
                    let candidateName = 'Unknown';

                    if (item.jobId) {
                        try {
                            const jobRes = await getJobById(item.jobId);
                            jobName = jobRes?.jobTitle || 'Unknown Job';
                        } catch (e) {
                            console.error(`Error fetching job ${item.jobId}`, e);
                        }
                    }

                    const candidateId = (item as any).candidateId;
                    // console.log("CANDIDATE: ", candidateId);
                    if (candidateId) {
                        try {
                            const userRes = await getUser(candidateId);
                            candidateName = userRes?.fullname || 'Unknown';
                            // console.log("NAME: ", candidateName);
                        } catch (e) {
                            console.error(`Error fetching user ${candidateId}`, e);
                        }
                    }

                    return {
                        ...item,
                        jobTitleDisplay: jobName,
                        candidateNameDisplay: candidateName
                    };
                }));

                setInterviewList(enrichedData);

            } catch (error) {
                console.error("Failed to fetch calendar data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const dateCellRender = (value: Dayjs) => {
        const listData = interviewList.filter(item => {
            return dayjs(item.scheduledAt).isSame(value, 'day');
        });

        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={(item as any)._id || Math.random()}>
                        <Badge
                            status={getBadgeStatus((item as any).status)}
                            text={`${item.candidateNameDisplay} - ${item.jobTitleDisplay}`}
                            title={`Candidate: ${item.candidateNameDisplay} | Job: ${item.jobTitleDisplay}`}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        return info.originNode;
    };

    return (
        <Spin spinning={loading} tip="Loading calendar...">
            <Calendar cellRender={cellRender} />
        </Spin>
    );
};

export default Calendar_Das;