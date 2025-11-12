import { useState, useEffect } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextareaAutosize, TextField } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { Dayjs } from "dayjs";
import type { Job } from "../../hook/useJob";
import useInterview from "../../hook/useInterview";
import type { Interview } from "../../utils/interfaces";
import useNotification from "../../hook/useNotification";
import useEmailService from "../../hook/useEmail";
import useUser from "../../hook/useUser";

type ModalContactCandidateProps = {
    job: Job;
    candidate_id: string;
    close: () => void;
    updateStatus?: (status: string) => void;
};

const ContactCandidate = ({ job, candidate_id, close, updateStatus }: ModalContactCandidateProps) => {
    const [animationClass, setAnimationClass] = useState<"slide-in" | "slide-out">("slide-out");
    const MySwal = withReactContent(Swal);

    const [time, setTime] = useState<Dayjs | null>(null);
    const [note, setNote] = useState<string>("");
    const [mode, setMode] = useState<'offline' | 'online'>('offline');
    const [location, setLocation] = useState<string>(job.address || "");
    const { createInterview, loading, error, clearError } = useInterview();
    const { sendInterviewInvite } = useEmailService();
    const { getUser: getCandidate, user: candidate } = useUser();
    const { getUser: getHr, user: hr } = useUser();
    const { createNotification } = useNotification();

    useEffect(() => {
        if (candidate_id) {
            getCandidate(candidate_id);
        }
    }, []);

    useEffect(() => {
        if (job.createBy._id) {
            getHr(job.createBy._id);
        }
    }, []);

    const handleClose = () => {
        setAnimationClass("slide-out");
        setTimeout(() => {
            close();
        }, 300);
    };

    useEffect(() => {
        const timer = setTimeout(() => setAnimationClass("slide-in"), 10);
        return () => clearTimeout(timer);
    }, []);

    // const hanldeSendRequest = () => {
    //     MySwal.fire({
    //         icon: "info",
    //         title: "Chức năng đang phát triển",
    //         // text: "Chức năng liên hệ đang được phát triển. Vui lòng thử lại sau.",
    //         text: `time: ${time}, note: ${note} location: ${location}`,
    //     });
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!time) {
            MySwal.fire({
                icon: "error",
                title: "Lỗi",
                text: `Vui lòng chọn thời gian`,
            });
            return;
        }

        const interviewData: Partial<Interview> = {
            chatRoomId: job.createBy._id,
            hrId: job.createBy._id,
            candidateId: candidate_id,
            jobId: job._id,
            scheduledAt: time.toString(),
            location: location,
            mode: mode,
            note: note,
        };

        try {

            const inter = await createInterview(interviewData);
            MySwal.fire({
                icon: "info",
                title: "Thành công",
                text: `Đã tạo lịch phỏng vấn thành công`,
            });
            setLocation("");
            setTime(null);
            setNote("");
            handleClose();

            await sendInterviewInvite({
                candidate: {
                    fullname: candidate?.fullname || "Ứng viên",
                    email: candidate?.email || "",
                },
                hr: {
                    fullname: hr?.fullname || "Nhân sự",
                    email: hr?.email || "",
                    companyName: job.department.name
                },
                job: {
                    title: job.jobTitle
                },
                interview: {
                    ...interviewData,
                    _id: "",
                } as Interview
            });

            updateStatus && updateStatus("contacted");

            await createNotification({
                receiverId: candidate_id,
                type: "INTERVIEW_INVITE",
                title: "Lời mời phỏng vấn",
                message: `Bạn đã được mời phỏng vấn cho vị trí ${job.jobTitle} tại ${job.department.name}.`,
                requestId: inter._id
            });

        } catch (err) {
            console.error(err);
            MySwal.fire({
                icon: "error",
                title: "Thất bại",
                text: `Tạo lịch phỏng vấn thất bại: ${error || "Lỗi không xác định"}`,
            });
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                bottom: 0,
                width: "100%",
                height: "60%",
                // backgroundColor: "#10B981",
                backgroundColor: "#FFF",
                boxShadow: "0 -4px 10px rgba(0,0,0,0.2)",
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                transition: "transform 0.3s ease-in-out",
                transform:
                    animationClass === "slide-in" ? "translateY(0)" : "translateY(100%)",
                padding: "24px",
                color: "#000",
                zIndex: 3000,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "auto",
            }}
        >
            <div>
                <h2
                    className="text-left text-emerald-600"
                    style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        marginBottom: "16px",
                    }}
                >
                    Liên hệ ứng viên công việc {job.jobTitle}
                </h2>
            </div>

            <div className="flex flex-col gap-4">

                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                            <DateTimePicker
                                label="Chọn thời gian phỏng vấn ứng viên"
                                defaultValue={time}
                                value={time}
                                onChange={(newValue) => setTime(newValue)}
                                // slotProps={{
                                //     textField: {
                                //         fullWidth: true,
                                //         sx: {
                                //             '& .MuiOutlinedInput-root': {
                                //                 '& fieldset': {
                                //                     borderColor: '#059669',
                                //                 },
                                //                 '&:hover fieldset': {
                                //                     borderColor: '#047857',
                                //                 },
                                //                 '&.Mui-focused fieldset': {
                                //                     borderColor: '#059669',
                                //                 },
                                //             },
                                //             '& .MuiInputLabel-root': {
                                //                 color: '#059669',
                                //                 '&.Mui-focused': {
                                //                     color: '#059669',
                                //                 },
                                //             },
                                //             '& .MuiInputBase-input': {
                                //                 color: '#059669',
                                //             },
                                //             '& .MuiSvgIcon-root': {
                                //                 color: '#059669',
                                //             },
                                //         },
                                //     },
                                // }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>


                <div className="w-full flex flex-col gap-0.5 text-left">
                    <span className="text-gray-400">
                        Hình thức
                    </span>
                    <select
                        className="w-full h-12 focus:ring-2 focus:ring-emerald-500 rounded-md border border-solid border-slate-300"
                        style={{ paddingLeft: 15, paddingRight: 15 }}
                        value={mode}
                        onChange={(e) => setMode(e.target.value as 'offline' | 'online')}
                    >
                        <option value="offline">Offline (Trực tiếp)</option>
                        <option value="online">Online</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-0.5 text-left">
                    <TextField
                        id="outlined-basic"
                        label="Chọn địa điểm phỏng vấn"
                        variant="outlined"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full text-sm font-sans font-normal leading-5"
                        sx={{
                            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                borderColor: '#059669',
                            },
                            '& label.Mui-focused': {
                                color: '#059669',
                            },
                            '& .MuiOutlinedInput-root:hover fieldset': {
                                borderColor: '#059669',
                            },
                        }}
                    />
                </div>

                <div className="w-full flex flex-col gap-0.5 text-left">
                    <span className="text-gray-400">
                        Ghi chú
                    </span>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Nhập ghi chú cho ứng viên..."
                        style={{ padding: 10 }}
                        className="
                        w-full text-sm font-sans font-normal leading-5 
                        px-3 py-2 rounded-lg 
                        shadow-md shadow-slate-100 
                        border border-solid border-slate-300 
                        bg-white text-slate-900 
                        box-border
                        
                        hover:border-emerald-600 
                        
                        focus:border-emerald-600 
                        focus:ring-2 focus:ring-emerald-600
                        focus-visible:outline-0
                    "
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

            </div>

            <div className="flex gap-2.5 items-center justify-end"
                style={{ marginTop: 10 }}
            >
                <button
                    onClick={handleClose}
                    style={{
                        alignSelf: "flex-end",
                        backgroundColor: "#e5e7eb",
                        color: "#111827",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#d1d5db")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e5e7eb")
                    }
                >
                    Đóng
                </button>

                <button
                    onClick={handleSubmit}
                    style={{
                        alignSelf: "flex-end",
                        backgroundColor: "#059669",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#047857")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#059669")
                    }
                    disabled={loading}
                >
                    {loading ? "Đang tạo..." : "Gửi lời mời"}
                </button>
            </div>
        </div>
    );
};

export default ContactCandidate;
