import React from 'react';
import './SeniorCVTemplate.css';

const FreshInternCVTemplate: React.FC = () => {
    return(
        <div className="cv-container">
            {/* START - Nội dung CV Fresher/Intern - START */}
            <header className="cv-header">
                <h1>[Tên Đầy Đủ Của Bạn - Senior]</h1>
                <p className="title">[Vị trí ứng tuyển, ví dụ: Software Engineer Intern | Fresher Frontend Developer]</p>
            </header>

            <section className="contact-info">
                <p><strong>Email:</strong> [email@example.com]</p>
                <p><strong>Phone:</strong> (84) [Số điện thoại]</p>
                <p><strong>LinkedIn:</strong> [linkedin.com/in/...]</p>
                <p><strong>GitHub/Portfolio:</strong> [github.com/...]</p>
            </section>

            <hr />

            <section className="summary">
                <h2>MỤC TIÊU NGHỀ NGHIỆP & TÓM TẮT</h2>
                <p>Sinh viên năm cuối/Mới tốt nghiệp chuyên ngành [Tên ngành] tại [Tên trường]. Đam mê sâu sắc với [Lĩnh vực chính, ví dụ: phát triển web/phân tích dữ liệu]. Có kiến thức vững chắc về **[Ngôn ngữ/Công nghệ cốt lõi]** thông qua các dự án cá nhân/môn học. Sẵn sàng học hỏi, có tinh thần trách nhiệm cao, tìm kiếm cơ hội Intern/Fresher để áp dụng kiến thức và đóng góp vào các sản phẩm thực tế.</p>
            </section>

            <hr />

            <section className="projects">
                <h2>DỰ ÁN CÁ NHÂN & THỰC HÀNH (QUAN TRỌNG NHẤT)</h2>

                {/* Dự án 1 (Quan trọng nhất) */}
                <div className="job-entry">
                    <h3>[Tên Dự Án Lớn Nhất]</h3>
                    <p className="company-date">
                        <a href="[Link GitHub/Demo]" target="_blank" rel="noopener noreferrer"><strong>[Link GitHub/Demo]</strong></a>
                    </p>
                    <ul>
                        <li>Xây dựng một ứng dụng [Loại ứng dụng, ví dụ: E-commerce/Social Network] hoàn chỉnh từ A-Z.</li>
                        <li>Sử dụng **[Công nghệ Frontend chính]** (React/Vue) và **[Công nghệ Backend chính]** (Node.js/Python).</li>
                        <li>Tự thiết kế cơ sở dữ liệu và triển khai API RESTful.</li>
                        <li>**(Thành tích):** Đạt điểm A cho đồ án môn học / Thu hút X người dùng thử.</li>
                    </ul>
                </div>

                {/* Dự án 2 (Một dự án khác chứng minh kỹ năng khác) */}
                <div className="job-entry">
                    <h3>[Tên Dự Án Khác]</h3>
                    <p className="company-date">
                        <a href="[Link GitHub/Demo]" target="_blank" rel="noopener noreferrer"><strong>[Link GitHub/Demo]</strong></a>
                    </p>
                    <ul>
                        <li>Thực hiện [Tính năng/Mục tiêu chính của dự án, ví dụ: Phân tích dữ liệu...] bằng [Công nghệ].</li>
                        <li>Áp dụng [Khái niệm kỹ thuật, ví dụ: Redux/State Management] để quản lý trạng thái hiệu quả.</li>
                    </ul>
                </div>
            </section>

            <hr />

            <section className="skills">
                <h2>KỸ NĂNG CHUYÊN MÔN</h2>
                <div className="skills-list">
                    <p><strong>Ngôn ngữ lập trình:</strong> JavaScript, Python, Java, C++ (Chọn 2-3 ngôn ngữ mạnh nhất)</p>
                    <p><strong>Frameworks/Thư viện:</strong> ReactJS, NodeJS, Express, Pandas, Sci-kit learn</p>
                    <p><strong>Cơ sở dữ liệu:</strong> SQL (MySQL/PostgreSQL), MongoDB</p>
                    <p><strong>Công cụ & Khác:</strong> Git, VS Code, Linux, Docker (nếu có kiến thức cơ bản)</p>
                </div>
            </section>

            <hr />

            <section className="education">
                <h2>HỌC VẤN</h2>
                <div className="education-entry">
                    <p><strong>[Bằng Cấp]</strong> - [Tên Trường Đại Học]</p>
                    <p className="company-date">[Năm bắt đầu] - [Năm dự kiến/tốt nghiệp]</p>
                    <p>GPA: [Điểm trung bình (Nếu cao) / Xếp loại tốt nghiệp]</p>
                    <p>Các môn học tiêu biểu: Cấu trúc dữ liệu và giải thuật, Hệ điều hành, Mạng máy tính, ...</p>
                </div>
            </section>
            
            <hr />
            
            <section className="activities">
                <h2>HOẠT ĐỘNG & THÀNH TÍCH KHÁC</h2>
                <ul>
                    <li>**Giải thưởng:** [Tên giải thưởng] trong cuộc thi [Tên cuộc thi] năm [Năm].</li>
                    <li>**Hoạt động tình nguyện/CLB:** Thành viên tích cực của CLB [Tên CLB] tại trường.</li>
                    <li>**Chứng chỉ:** Chứng chỉ [Tên chứng chỉ] từ [Nguồn, ví dụ: Coursera, Udemy].</li>
                </ul>
            </section>
            {/* END - Nội dung CV Fresher/Intern - END */}
        </div>
    );
}

export default FreshInternCVTemplate;