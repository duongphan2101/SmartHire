import React, { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import dayjs from "dayjs";

import useInterview from "../../hook/useInterview";
import useJob from "../../hook/useJob";
import useUser from "../../hook/useUser";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    completed: { bg: "#A7F3D0", text: "#047857" },   // xanh pastel
    confirmed: { bg: "#BFDBFE", text: "#1E40AF" },   // xanh dương pastel
    pending:   { bg: "#FDE68A", text: "#92400E" },   // vàng pastel
    rejected:  { bg: "#FECACA", text: "#B91C1C" },   // đỏ pastel
    failed:    { bg: "#FECACA", text: "#B91C1C" },   // đỏ pastel
    default:   { bg: "#E5E7EB", text: "#374151" },   // xám pastel
};

const statusMapVi: Record<string, string> = {
    completed: "Hoàn thành",
    confirmed: "Đã xác nhận",
    pending: "Đang chờ",
    rejected: "Từ chối",
    failed: "Thất bại",
};

const Calendar_FC: React.FC = () => {
    const { fetchAllInterviews } = useInterview();
    const { getJobById } = useJob();
    const { getUser } = useUser();

    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getColor = (status?: string) => {
        const key = status?.toLowerCase() ?? "default";
        return STATUS_COLORS[key] || STATUS_COLORS.default;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const userStored = localStorage.getItem("user");
                const parsed = JSON.parse(userStored || "{}");
                const adminId = parsed.user_id ?? parsed._id;

                const list = await fetchAllInterviews(adminId);
                const interviews = list ?? [];

                const enriched = await Promise.all(
                    interviews.map(async (it) => {
                        let jobName = "Unknown Job";
                        let candidateName = "Unknown";

                        try {
                            const job = it.jobId ? await getJobById(it.jobId) : null;
                            jobName = job?.jobTitle || jobName;
                        } catch {}

                        try {
                            const user = it.candidateId ? await getUser(it.candidateId) : null;
                            candidateName = user?.fullname || candidateName;
                        } catch {}

                        return {
                            ...it,
                            jobTitleDisplay: jobName,
                            candidateNameDisplay: candidateName,
                        };
                    })
                );

                // Build FullCalendar events
                const fc = enriched.map((ev) => {
                    const color = getColor(ev.status);

                    return {
                        id: ev._id,
                        title: `${ev.candidateNameDisplay} - ${ev.jobTitleDisplay}`,
                        date: dayjs(ev.scheduledAt).format("YYYY-MM-DD"),
                        backgroundColor: color.bg,
                        borderColor: color.bg,
                        textColor: color.text,
                        extendedProps: ev,
                    };
                });

                setEvents(fc);
            } catch (err) {
                console.error("Load calendar failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEventClick = useCallback((info: any) => {
        const ev = info.event.extendedProps;
        const status = statusMapVi[ev.status?.toLowerCase()] ?? "Không xác định";

        toast.info(
            `Ứng viên: ${ev.candidateNameDisplay}\nCông việc: ${ev.jobTitleDisplay}\nTrạng thái: ${status}`,
            { position: "bottom-right", autoClose: 5000, theme: "light" }
        );
    }, []);

    return (
        <>
            <ToastContainer />

            {loading ? (
                <p className="text-center py-6 text-gray-500">Đang load lịch…</p>
            ) : (
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventClick={handleEventClick}
                    height="80vh"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,dayGridWeek,dayGridDay,dayGridYear",

                    }}
                />
            )}
        </>
    );
};

export default Calendar_FC;
