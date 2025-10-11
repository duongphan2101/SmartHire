import { useState } from "react";
import "./Modal-AI-Recomend.css";
import useCV from "../../hook/useCV";
import Swal from "sweetalert2";

// --- INTERFACES (giữ nguyên) ---
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

    // --- STATE MANAGEMENT (giữ nguyên) ---
    const [suggestion, setSuggestion] = useState<CVAIResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- LOGIC (giữ nguyên) ---
    const handleGetSuggestion = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestion(null); // Xóa gợi ý cũ khi tạo gợi ý mới

        try {
            let result: CVAIResponse | void;
            switch (type) {
                case "Summary":
                    result = await optimizeSummary(content);
                    break;
                case "Experience":
                    result = await optimizeExperience(content);
                    break;
                case "ProjectDescription":
                    result = await optimizeProjects(content);
                    break;
                default:
                    throw new Error("Loại gợi ý không hợp lệ.");
            }
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


    // --- RENDER LOGIC (đã thay đổi) ---
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
                    {isLoading && (
                        <div className="state-overlay">
                            <div className="loader"></div>
                            <p>AI đang suy nghĩ...</p>
                        </div>
                    )}
                    {error && !isLoading && (
                         <div className="state-overlay">
                            <p className="error-message">{error}</p>
                        </div>
                    )}
                    <textarea
                        value={getSuggestionValue()}
                        className="ip-body-content w-full p-2"
                        placeholder="Nhấn '✨ Gợi ý mới' để AI tạo nội dung cho bạn..."
                        readOnly
                    />
                </div>
                
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
    );
};

export default Modal_AI_Recomend;

