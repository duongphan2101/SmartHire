import { useRef, useState } from "react";
import CoinCard from "./CoinCard";
import "./Payment.css";
import { FaArrowRight } from 'react-icons/fa6';

import usePayment from "../../hook/usePayment";

import momo from "../../assets/images/logo-momo.webp";
import napas from "../../assets/images/icon-atm-credit.png";
import vnpay from "../../assets/images/vnpay.png";
import bank from "../../assets/images/icon-bank-building.png";
import ModalConfirm from "./ModalConfirm";

const Payment = () => {
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
    const [selectedMethodBank, setSelectedMethodBank] = useState<string>("");
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const payRef = useRef<HTMLDivElement | null>(null);
    const [enableMethod, setEnableMethod] = useState<boolean>(false);
    const [enableConfirm, setEnableConfirm] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { transactions } = usePayment();

    const packages = [
        { coins: 20, title: "Gói Coin Basic", description: ["Nạp nhanh chóng", "Dành cho nhu cầu nhỏ"], price: 20000 },
        { coins: 50, title: "Gói Coin Standard", description: ["Ưu đãi vừa phải", "Dùng cho đăng vài bài"], price: 50000 },
        { coins: 100, title: "Gói Coin Premium", description: ["Giá siêu ưu đãi", "Hỗ trợ nhiều phương thức"], price: 100000 },
        { coins: 500, title: "Gói Coin VIP", description: ["Tiết kiệm tối đa", "Đăng nhiều bài không lo"], price: 500000 },
    ];

    const methods = [
        { id: 1, name: "Thẻ nội địa", icon: napas },
        { id: 2, name: "Ví MoMo", icon: momo },
        { id: 3, name: "VNPay", icon: vnpay },
        { id: 4, name: "Chuyển khoản ngân hàng", icon: bank },
    ];

    const handlePick = (coin: number, idx: number) => {
        setSelectedPackage(idx);
        setEnableMethod(true);
        setSelectedMethod(null);
        setEnableConfirm(false);

        if (payRef.current) {
            payRef.current.scrollIntoView({ behavior: "smooth" });
        }
        console.log("Coin: ", coin);
    };

    const handlePick_Bank = (idx: number, bank: string) => {
        if (!enableMethod) return;
        setSelectedMethod(idx);
        setSelectedMethodBank(bank);
        setEnableConfirm(true);
        console.log("Bank: ", selectedMethod);
    };

    const handleConfirm = () => {
        setOpenModal(true);
    }

    const handleCloseConfirm = () => {
        setOpenModal(false);
    }

    return (
        <div className="bg-white min-h-screen relative" style={{ padding: 10 }}>

            {openModal && (
                <ModalConfirm
                    method_id={methods.find(m => m.id === selectedMethod)?.id || 0}
                    coin={packages[selectedPackage!].coins}
                    method={selectedMethodBank}
                    close={handleCloseConfirm}
                />
            )}

            {/* Giới thiệu */}
            <div className="text-center" style={{ marginBottom: 8 }}>
                <h1 className="text-2xl font-bold text-gray-800">
                    Nạp Coin để trải nghiệm nhiều tính năng hơn
                </h1>
                <p className="text-gray-600" style={{ marginBottom: 8 }}>
                    Chọn gói coin phù hợp với nhu cầu của bạn. Giá siêu ưu đãi, thanh toán dễ dàng.
                </p>
            </div>

            {/* Card các gói coin */}
            <div className="flex flex-wrap justify-center" style={{ marginBottom: 10 }}>
                {packages.map((pkg, idx) => (
                    <div key={idx} onClick={() => handlePick(pkg.coins, idx)}>
                        <CoinCard
                            coins={pkg.coins}
                            title={pkg.title}
                            description={pkg.description}
                            price={pkg.price}
                            active={selectedPackage === idx}
                        />
                    </div>
                ))}
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white" id="pay" ref={payRef} style={{ padding: 10, marginTop: 40 }}>
                <h2 className="text-xl font-semibold text-gray-800" style={{ marginBottom: 15 }}>
                    Chọn hình thức thanh toán
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {methods.map((m) => (
                        <div
                            key={m.id}
                            onClick={() => handlePick_Bank(m.id, m.name)}
                            className={`flex items-center gap-3 border rounded-lg cursor-pointer transition flex-col
                                ${!enableMethod
                                    ? "opacity-50 cursor-not-allowed"
                                    : selectedMethod === m.id
                                        ? "border-green-500 bg-green-50 shadow-emerald-600/20 shadow-xl"
                                        : "border-green-300 hover:bg-gray-50 shadow-xl"}`}
                            style={{ padding: 10 }}
                        >
                            <img src={m.icon} className="icon-payment" />
                            <span className="text-gray-700">{m.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nút xác nhận */}
            <div className="flex justify-end" style={{ paddingTop: 60, paddingBottom: 20, paddingRight: 10 }}>
                <button
                    disabled={!enableConfirm}
                    className={`btn-confirm px-6 py-2 rounded-lg text-white font-semibold transition flex gap-2.5 items-center
                        ${enableConfirm ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed"}`}
                    onClick={handleConfirm}
                >
                    Xác nhận
                    <FaArrowRight />
                </button>
            </div>

            <div style={{ padding: 10, marginTop: 15 }}>
                <h5 className="font-bold text-2xl" style={{ marginBottom: 20 }}>Lịch sử giao dịch</h5>

                <div className="bg-gray-50 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-emerald-500 text-white">
                            <tr>
                                <th className="p-2">#</th>
                                <th className="p-2">Số tiền</th>
                                <th className="p-2">Loại</th>
                                <th className="p-2">Trạng thái</th>
                                <th className="p-2">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions && transactions.length > 0 ? (
                                transactions.map((tx, idx) => (
                                    <tr
                                        key={tx.id || idx}
                                        className="border-b last:border-none hover:bg-emerald-50"
                                    >
                                        <td style={{ padding: 5 }}>{idx + 1}</td>
                                        <td className="font-semibold text-emerald-700" style={{ padding: 5 }}>
                                            {tx.amount.toLocaleString()} {tx.currency}
                                        </td>
                                        <td style={{ padding: 5 }}>
                                            {tx.type === "DEPOSIT" ? "Nạp tiền" : tx.type === "WITHDRAW" ? "Rút tiền" : "Thanh toán"}
                                        </td>
                                        <td
                                            style={{ padding: 5 }}
                                            className={`font-bold ${tx.status === "SUCCESS"
                                                ? "text-green-600"
                                                : tx.status === "PENDING"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {tx.status}
                                        </td>
                                        <td style={{ padding: 5 }}>
                                            {new Date(tx.createdAt).toLocaleString("vi-VN")}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-500" style={{padding: 15}}>
                                        Chưa có giao dịch nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Payment;
