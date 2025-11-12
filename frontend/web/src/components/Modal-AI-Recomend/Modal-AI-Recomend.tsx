import { useState } from "react";
import "./Modal-AI-Recomend.css";
import useCV from "../../hook/useCV";
import Swal from "sweetalert2";
import { Button, CircularProgress, TextField } from "@mui/material";

type OptimizeParams = {
    content?: string;
    previousResult?: string;
    refinementPrompt?: string;
}

interface ModalProps {
    content: string;
    onClose: () => void;
    type: string;
    onApply: (suggestion: string) => void;
}
export interface CVAIResponse {
    optimizedSummary?: string;
    optimizedSkills?: string[];
    optimizedExperience?: string;
    optimizedEducation?: string;
    optimizedProjects?: string;
}

const Modal_AI_Recomend: React.FC<ModalProps> = ({ content, onClose, type, onApply }) => {
    const { optimizeSummary, optimizeExperience, optimizeProjects } = useCV();

    // --- STATE MANAGEMENT ---
    const [suggestion, setSuggestion] = useState<CVAIResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [refinementPrompt, setRefinementPrompt] = useState<string>("");

    const callAIFunction = async (params: OptimizeParams) => {
        const buildInput = () => {
            const base = params.previousResult ?? params.content ?? "";
            const refinement = params.refinementPrompt ? params.refinementPrompt.trim() : "";
            if (refinement) {
                return `${base}\n\nRefinement: ${refinement}`;
            }
            return base;
        };

        const input = buildInput();

        switch (type) {
            case "Summary":
                return await optimizeSummary(input);
            case "Experience":
                return await optimizeExperience(input);
            case "ProjectDescription":
                return await optimizeProjects(input);
            default:
                throw new Error("Loại gợi ý không hợp lệ.");
        }
    };

    // 1. Lấy Gợi ý Mới (Tạo mới)
    const handleGetSuggestion = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestion(null);
        setRefinementPrompt("");

        try {
            const result = await callAIFunction({ content });
            if (!result) {
                setError("AI không thể tạo gợi ý lúc này, vui lòng thử lại.");
            } else {
                setSuggestion(result);
            }
        } catch (err) {
            console.error(`Tối ưu ${type} thất bại`, err);
            setError("Gợi ý thất bại, vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Chỉnh sửa Gợi ý (MỚI)
    const handleRefine = async () => {
        const previousResult = getSuggestionValue();
        if (!refinementPrompt.trim() || !previousResult) {
            setError("Vui lòng nhập chỉ dẫn chỉnh sửa.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const params = { previousResult, refinementPrompt };
            const result = await callAIFunction(params);

            if (!result) {
                setError("AI không thể chỉnh sửa lúc này, vui lòng thử lại.");
            } else {
                setSuggestion(result); // Cập nhật suggestion với kết quả mới
            }
        } catch (err) {
            console.error(`Chỉnh sửa ${type} thất bại`, err);
            setError("Chỉnh sửa thất bại, vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
            setRefinementPrompt("");
        }
    };

    const getSuggestionValue = () => {
        if (!suggestion) return "";
        switch (type) {
            case "Summary": return suggestion.optimizedSummary ?? "";
            case "Experience": return suggestion.optimizedExperience ?? "";
            case "ProjectDescription": return suggestion.optimizedProjects ?? "";
            default: return "";
        }
    };

    const handleCopy = async () => {
        const valueToCopy = getSuggestionValue();
        if (!valueToCopy) {
            Swal.fire({ icon: "warning", title: "Không có nội dung để sao chép!" });
            return;
        }
        try {
            await navigator.clipboard.writeText(valueToCopy);
            Swal.fire({
                icon: "success",
                title: "Đã sao chép!",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error("Lỗi sao chép:", err);
            Swal.fire({ icon: "error", title: "Sao chép thất bại!" });
        }
    };

    const handleApply = () => {
        const valueToApply = getSuggestionValue();
        if (valueToApply) {
            onApply(valueToApply);
        }
        onClose();
    };


    return (
        <div className="modal-ai-recomend w-full">
            <div className="modal-ai-recomend-box">
                <div className="recomend-box_head flex items-center justify-between bg-emerald-600 px-3">
                    <h4 className="text-white">AI gợi ý {type}</h4>
                    <button className="text-white text-2xl font-bold hover:text-red-500" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="recomend-box_body bg-white text-left">
                    {/* Lớp phủ cho trạng thái loading và error */}
                    {(isLoading || (error && !isLoading)) && (
                        <div className="state-overlay">
                            {isLoading ? (
                                <>
                                    <div className="loader"></div>
                                    <p>AI đang suy nghĩ...</p>
                                </>
                            ) : (
                                <p className="error-message">{error}</p>
                            )}
                        </div>
                    )}

                    <textarea
                        value={getSuggestionValue()}
                        className="ip-body-content w-full p-2"
                        placeholder="Nhấn '✨ Gợi ý mới' để AI tạo nội dung cho bạn..."
                        readOnly
                    />

                    {!isLoading && suggestion && (
                        <div className="refinement-area">

                            <TextField
                                fullWidth
                                label="Yêu cầu AI chỉnh sửa (vd: ngắn gọn hơn, chuyên nghiệp hơn)"
                                value={refinementPrompt}
                                onChange={(e) => setRefinementPrompt(e.target.value)}
                                margin="normal"
                                disabled={isLoading}
                                variant="outlined"
                                onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
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
                                disabled={isLoading || !refinementPrompt.trim()}
                                sx={{
                                    mt: 1,
                                    textTransform: 'none',
                                    backgroundColor: '#059669',
                                    '&:hover': {
                                        backgroundColor: '#047857',
                                    },
                                }}
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {isLoading ? "Đang chỉnh sửa..." : "Chỉnh sửa bằng AI"}
                            </Button>
                        </div>
                    )}

                    {/* Thanh công cụ luôn hiển thị */}
                    <div className="recomend-box_bottom bg-white flex justify-end items-center p-2">
                        <div className="flex gap-2">
                            <button
                                className="btn-get-suggestion"
                                onClick={handleGetSuggestion}
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang tải..." : "✨ Gợi ý mới"}
                            </button>
                            <button
                                className="btn-coppy"
                                onClick={handleCopy}
                                disabled={!suggestion || isLoading}
                            >
                                Sao chép
                            </button>
                            <button
                                className="bg-emerald-600 text-white btn-acept"
                                onClick={handleApply}
                                disabled={!suggestion || isLoading}
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal_AI_Recomend;