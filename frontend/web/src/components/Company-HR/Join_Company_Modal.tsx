import { useState } from "react";
import "./Join_Company_Modal.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useDepartment from "../../hook/useDepartment";

interface JoinCompanyProps {
    onClose: () => void;
    reFresh: () => void;
}

const MySwal = withReactContent(Swal);

export const Join_Company_Modal: React.FC<JoinCompanyProps> = ({ onClose, reFresh }) => {
    const [joinCode, setJoinCode] = useState<string>("");
    const { joinDepartment, joinResponse } = useDepartment("user");

    const handleJoin = async () => {
        if (!joinCode.trim()) {
            MySwal.fire("Lỗi!", "Vui lòng nhập mã công ty", "error");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user._id || user.user_id;

        try {
            await joinDepartment(joinCode, userId);
            MySwal.fire("Thành công!", joinResponse?.message || "Đã tham gia công ty!", "success");
            onClose();
            reFresh();
        } catch (err) {
            MySwal.fire("Thất bại!", joinResponse?.message || "Mã đã hết hạn hoặc hết lượt sử dụng!" , "error");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/15 bg-opacity-50 flex justify-center items-center z-50"
            style={{ padding: "20px" }}
            onClick={onClose}
        >
            <div
                className="modal-joincompany-content bg-white rounded-2xl shadow-2xl w-full max-w-md text-center transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
                style={{ padding: "30px" }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    Tham gia công ty
                </h2>
                <p
                    className="text-gray-500"
                    style={{ marginTop: 20, marginBottom: 20 }}
                >
                    Nhập mã để tham gia công ty.
                </p>

                <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Nhập mã công ty..."
                    className="w-full border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                    style={{ padding: "10px 14px", marginBottom: "20px" }}
                />

                <div className="flex justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                        style={{ padding: "10px 18px" }}
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleJoin}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-md transition-all"
                        style={{ padding: "10px 18px" }}
                    >
                        Tham gia
                    </button>
                </div>
            </div>
        </div>
    );
};
