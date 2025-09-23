import { useEffect, useState } from "react";
import "./Modal-AI-Recomend.css";
import useCV from "../../hook/useCV";
import Swal from "sweetalert2";
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
    const [suggestion, setSuggestion] = useState<CVAIResponse | null>(null);

    useEffect(() => {
        if (type === "Summary" && content) {
            (async () => {
                try {
                    const result = await optimizeSummary(content);
                    setSuggestion(result ?? null);
                } catch (err) {
                    console.error("Optimize summary failed", err);
                }
            })();
        } if (type === "Experience" && content) {
            (async () => {
                try {
                    const result = await optimizeExperience(content);
                    setSuggestion(result ?? null);
                } catch (err) {
                    console.error("Optimize experience failed", err);
                }
            })();
        } if (type === "ProjectDescription" && content) {
            (async () => {
                try {
                    const result = await optimizeProjects(content);
                    setSuggestion(result ?? null);
                    console.log("SUGGEST: ", suggestion);
                } catch (err) {
                    console.error("Optimize description failed", err);
                }
            })();
        }
    }, [type, content, optimizeSummary, optimizeExperience, optimizeProjects]);

    const getSuggestionValue = () => {
        if (!suggestion) return "";
        switch (type) {
            case "Summary":
                return suggestion.optimizedSummary ?? "";
            case "Skills":
                return suggestion.optimizedSkills?.join("\n") ?? "";
            case "Experience":
                return suggestion.optimizedExperience ?? "";
            case "Education":
                return suggestion.optimizedEducation ?? "";
            case "ProjectDescription":
                return suggestion.optimizedProjects ?? "";
            default:
                return "";
        }
    };

    const handleCopy = async () => {
        try {
            const valueToCopy = getSuggestionValue();
            if (valueToCopy) {
                await navigator.clipboard.writeText(valueToCopy);
                Swal.fire({
                    icon: "success",
                    title: "Đã copy nội dung gợi ý!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Không có nội dung để copy!",
                });
            }
        } catch (err) {
            console.error("Copy failed", err);
            Swal.fire({
                icon: "error",
                title: "Copy thất bại!",
                text: String(err)
            });
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
                    <button className="text-white hover:text-red-500" onClick={onClose}>
                        x
                    </button>
                </div>

                <div className="recomend-box_body bg-white text-left">
                    <textarea
                        value={getSuggestionValue()}
                        className="ip-body-content w-full p-2"
                        placeholder="AI sẽ gợi ý cho bạn ..."
                        readOnly
                    />
                </div>

                <div className="recomend-box_bottom bg-white flex justify-end items-center p-2">
                    <div className="flex gap-2">
                        <button className="text-white btn-coppy" onClick={handleCopy}>
                            Sao chép
                        </button>
                        <button
                            className="bg-emerald-600 text-white btn-acept"
                            onClick={handleApply}
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
