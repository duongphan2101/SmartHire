import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import './Profile.css';
import { FaEdit } from 'react-icons/fa';
import { TbWorld } from 'react-icons/tb';
import { FaGithub } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';

import useUser from "../../hook/useUser";

const Profile: React.FC = () => {

    const { getUser, user } = useUser();
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');


    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const idToFetch = parsed.user_id ?? parsed._id;
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
            setUserRole(user.role || "");
        }
    }, [user]);

    return (
        <div className="profile-container bg-gray-50">

            <Header />

            <div className="profile-content">
                <ul className="profile-nav flex gap-2"
                    style={{ padding: '10px' }}
                >
                    <li className="profile-nav_item text-blue-400"><a href="/home">Home</a></li>
                    <li className="profile-nav_item text-blue-400">/</li>
                    <li className="profile-nav_item text-gray-400"><a href="">Profile</a></li>
                </ul>

                <div className="profile-details flex flex-wrap xl:flex-nowrap"
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
                                        <div className="avtar-edit" onClick={() => alert('Edit avatar clicked!')}>
                                            <FaEdit size={24} color="#fff" />
                                        </div>
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
                                        <select
                                            className="input"
                                            value={userRole}
                                            onChange={(e) => setUserRole(e.target.value)}
                                            required
                                        >
                                            <option value="user">User</option>
                                            <option value="hr">HR</option>
                                        </select>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Role</label>
                                    </div>


                                    <button className="button" onClick={() => alert('Save changes clicked!')}>
                                        Save Changes
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>


            </div>

            <Footer />

        </div>
    );
};

export default Profile;