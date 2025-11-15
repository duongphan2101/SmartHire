import React, { useEffect, useState, useRef } from "react";
import useUser, { type UserResponse } from "../../hook/useUser";
import useDepartment from "../../hook/useDepartment";
import "./HRList.css";

const HRList: React.FC = () => {
  const { getAllHR, loadingUser, errorUser, banUser, unbanUser } = useUser();
  const { departments } = useDepartment("all");

  const [hrList, setHrList] = useState<UserResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHR, setFilteredHR] = useState<UserResponse[]>([]);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchHR = async () => {
      const res = await getAllHR();
      if (res) {
        setHrList(res);
        setFilteredHR(res);
      }
    };
    fetchHR();
  }, [getAllHR]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (!value.trim()) {
        setFilteredHR(hrList);
      } else {
        // --- LOGIC TÌM KIẾM ĐÃ CẬP NHẬT ---
        const searchValue = value.toLowerCase();

        const filtered = hrList.filter(
          (hr) => {
            // 1. Kiểm tra tên HR
            const nameMatch = hr.fullname.toLowerCase().includes(searchValue);

            // 2. Kiểm tra email HR
            const emailMatch = hr.email.toLowerCase().includes(searchValue);

            // 3. Tìm công ty (department) của HR
            const company = departments.find((d) =>
              d.employees?.includes(hr._id)
            );

            // 4. Kiểm tra tên công ty (nếu có)
            const departmentMatch = company
              ? company.name.toLowerCase().includes(searchValue)
              : false;

            // Trả về true nếu 1 trong 3 điều kiện khớp
            return nameMatch || emailMatch || departmentMatch;
          }
        );
        setFilteredHR(filtered);
        // --- KẾT THÚC CẬP NHẬT ---
      }
    }, 300);
  };

  if (loadingUser)
    return <div className="hr-loading">Đang tải danh sách HR...</div>;
  if (errorUser) return <div className="hr-error">{errorUser}</div>;

  return (
    <div className="hr-list-container">
      <div className="hr-search-container">
        <input
          type="text"
          placeholder="Tìm kiếm HR theo tên hoặc email hoặc tên công ty..."
          className="hr-search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="hr-grid">
        {filteredHR.length === 0 ? (
          <p className="hr-empty">Không có HR nào được tìm thấy</p>
        ) : (
          filteredHR.map((hr) => {
            const company = departments.find((d) =>
              d.employees?.includes(hr._id)
            );

            return (
              <div className="hr-card shadow-2xs" key={hr._id}>
                <img
                  src={hr.avatar || 'https://placehold.co/100x100/EBF4FF/76A9FA?text=HR'}
                  alt={hr.fullname}
                  className="hr-avatar"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/EBF4FF/76A9FA?text=HR'; }}
                />
                <div className="hr-info">
                  <h3>{hr.fullname}</h3>
                  <h4 className="text-black">{hr.email}</h4>
                  {company ? (
                    <h4 className="text-black">Công ty: {company.name}</h4>
                  ) : (
                    <p className="no-company">Chưa thuộc công ty nào</p>
                  )}

                  {hr.phone && <p>📞 {hr.phone}</p>}
                  <button
                    className={`ban-btn ${hr.status === "banned" ? "unban" : ""
                      }`}
                    onClick={() =>
                      hr.status === "banned"
                        ? unbanUser(hr._id).then(() =>
                          setFilteredHR((prev) =>
                            prev.map((u) =>
                              u._id === hr._id
                                ? { ...u, status: "active" }
                                : u
                            )
                          )
                        )
                        : banUser(hr._id).then(() =>
                          setFilteredHR((prev) =>
                            prev.map((u) =>
                              u._id === hr._id
                                ? { ...u, status: "banned" }
                                : u
                            )
                          )
                        )
                    }
                  >
                    {hr.status === "banned" ? "Bỏ khóa" : "Khóa"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HRList;
