import React, { useEffect } from "react";
import "./Detail_Company.css";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import useDepartment from "../../hook/useDepartment";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import defaultAVT from "../../assets/images/logo_v1.png"

const Detail_Company: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const { department, loading, error, getDepartmentById } = useDepartment("user");

    useEffect(() => {
        const fetchCompany = async () => {
            if (!id) return;

            try {
                await getDepartmentById(id);
            } catch (err) {
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
        <div className="detail-company-container">
            <Header />

            <div className="detail-company-body">

                <div className="bg-white rounded-sm shadow-md text-left"
                    style={{ padding: 20, fontWeight: '600' }}
                >
                    <h2 className="hover:text-emerald-600 cursor-pointer">Thông tin chi tiết công ty {department?.name}</h2>
                </div>

                <div className="flex justify-between gap-3.5"
                    style={{ marginTop: 20 }}
                >
                    <div className="company-logo-box shadow-md">
                        <img
                            src={department?.avatar || defaultAVT}
                            alt="Company Logo"
                            className="company-logo"
                        />
                    </div>

                    <div className="bg-white rounded-sm shadow-md text-left flex-1"
                        style={{ padding: 20, fontWeight: '500', textAlign: 'justify' }}
                    >
                        <p><span className="font-bold">Tên công ty:</span> {department?.name || "Lỗi"}</p>
                        <p><span className="font-bold">Mô tả công ty:</span> {department?.description || "Lỗi"}</p>
                        <p><span className="font-bold">Địa chỉ công ty:</span> {department?.address || "Lỗi"}</p>
                        <p><span className="font-bold">Website:</span> <a className="hover:text-blue-400" href={department.website}>{department?.website || "Lỗi"}</a></p>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Detail_Company;
