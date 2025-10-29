import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useDepartment from "../../hook/useDepartment";
import { useParams } from "react-router-dom";
import defaultAVT from "../../assets/images/logo_v1.png"

const Modal_Detail_Company: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { department, loading, error, getDepartmentById } = useDepartment("user");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchCompany = async () => {
            if (!id) return;
            try {
                await getDepartmentById(id);
            }

            catch (err) {
                console.error("Error fetching company:", err);
            }
        };
        fetchCompany();
    }, [id, getDepartmentById]);

    useEffect(() => {
        if (error) {
            console.error("Failed to fetch:", error);
            Swal.fire("Error", "Failed to fetch company details", "error");
        }
    }, [error]);

    if (loading) {
        return <div className="page-container"><h1>Đang tải...</h1></div>;
    }

    if (!department) {
        return <div className="page-container"><h1>Không tìm thấy thông tin công ty.</h1></div>;
    }
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Xem chi tiết công ty
            </button>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Thông tin chi tiết công ty {department?.name}</h2>
                        <div className="company-logo-box">
                            <img

                                src={department?.avatar || defaultAVT}
                                alt="Company Logo"
                                className="company-logo"
                            />
                        </div>
                        <div className="company-details">
                            <p><span className="font-bold">Tên công ty:</span> {department?.name || "Lỗi"}</p>
                            <p><span className="font-bold">Mô tả công ty:</span> {department?.description || "Lỗi"}</p>
                            <p><span className="font-bold">Địa chỉ công ty:</span> {department?.address || "Lỗi"}</p>
                            <p><span className="font-bold">Website:</span> <a className="hover:text-blue-400"
                                href={department.website}>{department?.website || "Lỗi"}</a></p>
                        </div>
                        <button

                            onClick={() => setIsOpen(false)}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};  