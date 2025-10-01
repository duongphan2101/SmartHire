import { useEffect, useState } from "react";
import "./ModalConfirm.css";
import Swal from "sweetalert2";

type ModalConfirmProps = {
    method: number;
    coin: number;
    close: () => void;
};

const ModalConfirm = ({ method, coin, close }: ModalConfirmProps) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            close();
        }, 300);
    };

    const handleSuccess = () => {
        Swal.fire({
            title: "Thành công",
            text: "Nạp Coin thành công!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            showCancelButton: true,
        });
        handleClose();
    };

    const handleExit = () => {
        Swal.fire({
            title: "Bạn có chắc muốn hủy giao dịch?",
            text: "Hành động này sẽ đóng form xác nhận!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, hủy giao dịch",
            cancelButtonText: "Không"
        }).then((result) => {
            if (result.isConfirmed) {
                handleClose();
                Swal.fire({ title: "Đã hủy!", text: "Giao dịch của bạn đã được hủy.", icon: "success", timer: 2000, timerProgressBar: true });
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
            <div
                className={`modal-panel ${isClosing ? "closing" : ""}`}
                style={{ paddingTop: 120, paddingLeft: 15, paddingRight: 15 }}
            >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Xác nhận thanh toán
                </h2>
                <p className="mb-2 text-gray-700">
                    Bạn chọn gói <b>{coin} Coin</b>
                </p>
                <p className="mb-4 text-gray-700">
                    Phương thức: <b>{method}</b>
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        className="modal-confirm_btn confirm-btn_exit rounded bg-gray-300 hover:bg-gray-400 transition"
                        onClick={handleExit}
                    >
                        Hủy
                    </button>
                    <button className="modal-confirm_btn confirm-btn_confirm rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
                        onClick={handleSuccess}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirm;
