import React, { useState, useEffect, useRef } from "react";
import "./About-hr.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaEdit } from 'react-icons/fa';
import { TbWorld } from 'react-icons/tb';
import { FaGithub } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import useUser from "../../hook/useUser";
import useAuth from "../../hook/useAuth";
import { uploadToCloudinary } from "../../utils/cloudinary";
const About = () => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { getUser, user, updateUser, updateUserAvatar } = useUser();
    const { logout } = useAuth();
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [userDob, setUserDob] = useState<string>('');
    const [userPhone, setUserPhone] = useState<string>('');
    const MySwal = withReactContent(Swal);

    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const idToFetch = parsed.user_id ?? parsed._id;
                setUserId(idToFetch);
                getUser(idToFetch);
            }

        } catch (e) {
            console.error("Invalid user data in localStorage", e);
        }
    }, [getUser]);

    useEffect(() => {
        if (user) {
            setUserName(user.fullname || "");
            setUserEmail(user.email || "");
            setUserDob(user.dob ? user.dob.split("T")[0] : "");
            setUserPhone(user.phone || "");
        }
    }, [user]);


    const handleSaveChanges = async () => {
        if (userId) {
            try {
                // loading
                Swal.fire({
                    title: "Đang cập nhật...",
                    text: "Vui lòng chờ trong giây lát",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                await updateUser(userId, {
                    fullname: userName,
                    email: userEmail,
                    phone: userPhone,
                    dob: userDob,
                });

                // success
                Swal.fire({
                    icon: "success",
                    title: "Thành công!",
                    text: "Cập nhật hồ sơ thành công.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                // fail
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
                });
            }
        }
    };

    const handleEditAvatar = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        try {
            MySwal.fire({
                title: "Đang cập nhật...",
                text: "Vui lòng chờ trong giây lát",
                didOpen: () => {
                    MySwal.showLoading();
                },
                allowOutsideClick: false,
            });

            // Upload lên Cloudinary trước
            const imageUrl = await uploadToCloudinary(file);

            const res = await updateUserAvatar(userId, imageUrl);

            if (res) {
                await MySwal.fire({
                    title: "Thành công!",
                    text: "Cập nhật ảnh đại diện thành công!",
                    icon: "success",
                    confirmButtonText: "Xác nhận",
                });
            } else {
                throw new Error("No response from server");
            }
        } catch (err) {
            console.error("Update avatar error:", err);
            await MySwal.fire({
                title: "Thất bại!",
                text: "Có lỗi xảy ra khi cập nhật ảnh đại diện.",
                icon: "error",
                confirmButtonText: "Thử lại",
            });
        } finally {
            e.target.value = "";
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = "/home";
    };

    return (
        <>
            <div className="App">
                <div className="about-hr flex flex-wrap xl:flex-nowrap"
                    style={{ paddingTop: '20px', paddingBottom: '20px' }}
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 w-full">
                        {/* Trái 40% */}
                        <div className="lg:col-span-2">
                            <div className="profile-left flex flex-col items-center gap-4">

                                <div className="profile-card_avatar w-full bg-white p-4 flex flex-col items-center rounded-lg shadow-md"
                                    style={{ padding: '20px' }}
                                >
                                    <div className="profile-avatar_container">
                                        <div className="avtar-edit" onClick={handleEditAvatar}>
                                            <FaEdit size={24} color="#fff" />
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />

                                        <img
                                            src={user?.avatar}
                                            alt="User Avatar"
                                            className="profile-avatar"
                                        />
                                    </div>
                                    <p className="text-2xl" style={{ fontWeight: 'bold' }}>{user?.fullname}</p>
                                    <span>Full Stack Developer</span>
                                    <span>IUH, TP.HCM with love!</span>

                                </div>

                                <div className="profile-card_link w-full bg-white flex flex-col items-center rounded-lg shadow-md"
                                    style={{ padding: '5px' }}
                                >
                                    <ul className="card-link_list w-full flex flex-col gap-1.5">
                                        <li className="card-link_item">
                                            <span><TbWorld color="#3b82f6" /> Website</span>
                                            <a href="/" className="link_item_link">/myweb.vercel.com</a>
                                        </li>
                                        <li className="card-link_item">
                                            <span><FaGithub /> Github</span>
                                            <a href="/" className="link_item_link">/mygithub.github.io</a>
                                        </li>
                                        <li className="card-link_item">
                                            <span><FaLinkedin color="#3b82f6" /> Linkedin</span>
                                            <a href="/" className="link_item_link">/myLinkedin.com</a>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>

                        {/* Phải 60% */}
                        <div className="lg:col-span-4">
                            <div className="profile-right flex flex-col items-center gap-4">

                                <div className="profile-card_about w-full bg-white p-4 rounded-lg shadow-md flex flex-col gap-10">

                                    <div className="group">
                                        <input type="text" className="input" required
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Name</label>
                                    </div>

                                    <div className="group">
                                        <input type="text" className="input" required
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Email</label>
                                    </div>

                                    <div className="group">
                                        <input type="date" className="input" required
                                            value={userDob}
                                            onChange={(e) => setUserDob(e.target.value)}
                                            placeholder="YYYY-MM-DD"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Date of birth</label>
                                    </div>

                                    <div className="group">
                                        <input type="text" className="input" required
                                            value={userPhone}
                                            onChange={(e) => setUserPhone(e.target.value)}
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Phone</label>
                                    </div>

                                    <div className="flex gap-5">
                                        <button className="button" onClick={handleSaveChanges}>
                                            Save Changes
                                        </button>

                                        <button className="btn-logout" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;