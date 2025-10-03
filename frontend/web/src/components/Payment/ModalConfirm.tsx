import { useEffect, useState } from "react";
import "./ModalConfirm.css";
import Swal from "sweetalert2";
import usePayment from "../../hook/usePayment";

type ModalConfirmProps = {
    method_id: number;
    coin: number;
    method: string;
    close: () => void;
};

const ModalConfirm = ({ method_id, coin, method, close }: ModalConfirmProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const { createPayment } = usePayment();

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

    const handleSuccess = async () => {
        const cost = coin * 10;
        const url = await createPayment(cost);
        if (url) {
            window.location.href = url;
        }
        console.log(method_id);
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

    const fortmatPrice = (cost: number): string => {
        const newCost = cost * 1000;
        return newCost.toLocaleString("vi-VN");
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
            <div
                className={`modal-panel ${isClosing ? "closing" : ""}`}
                style={{ paddingTop: 150, paddingLeft: 15, paddingRight: 15 }}
            >

                <h2 className="text-2xl font-semibold mb-4 text-emerald-600 text-left">
                    Xác nhận thanh toán
                </h2>

                <div className="flex items-center justify-between"
                    style={{ paddingTop: 20 }}
                >
                    <span className="text-gray-700 font-bold">
                        Bạn chọn gói :
                    </span>
                    <span>
                        {coin} Coin
                    </span>
                </div>

                <div className="flex items-center justify-between"
                    style={{ paddingTop: 20 }}
                >
                    <span className="text-gray-700 font-bold">
                        Phương thức thanh toán :
                    </span>
                    <span>
                        {method}
                    </span>
                </div>

                <div className="flex items-center justify-between"
                    style={{ paddingTop: 20 }}
                >
                    <span className="text-gray-700 font-bold">
                        Giá tiền :
                    </span>
                    <span>
                        {fortmatPrice(coin)} VND
                    </span>
                </div>

                <div className="flex justify-end gap-3" style={{ marginTop: 20 }}>
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
