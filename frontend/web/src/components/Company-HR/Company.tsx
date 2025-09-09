import "./Company.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaEye, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
// Define DepartmentData type if not imported
interface DepartmentData {
  _id: string;
  name: string;
  address: string;
  description: string;
  website: string;
  avatar: string;
}

interface CompanyProps {
  company: DepartmentData | null;
}

const Company: React.FC<CompanyProps> = ({ company }) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${HOSTS.companyService}/getAll`);
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      fetchCompanies();
      return;
    }

    try {
      const res = await fetch(
        `${HOSTS.companyService}/search?keyword=${value}`
      );
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error searching companies:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await MySwal.fire({
      title: "Bạn chắc chắn?",
      text: "Công ty này sẽ bị xóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`${HOSTS.companyService}/delete/${id}`, {
          method: "DELETE",
        });
        MySwal.fire("Đã xóa!", "Công ty đã được xóa.", "success");
        fetchCompanies();
      } catch (err) {
        console.error("Error deleting company:", err);
        MySwal.fire("Lỗi!", "Không thể xóa công ty.", "error");
      }
    }
  };

  return (
    <div className="company-profile-container">
      <div className="company-profile-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search company..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="add-button">
            <AiOutlinePlusCircle size={20} />
            Thêm
          </button>
        </div>
      </div>

      <div className="company-list">
        {companies.length > 0 ? (
          companies.map((company) => (
            <div key={company._id} className="company-wrapper">
              <div className="company-card">
                <img
                  src={company.avatar}
                  alt={company.name}
                  className="company-profile-avatar"
                />
                <div className="company-details">
                  <h3>{company.name}</h3>
                  <p>
                    <strong>Address:</strong> {company.address}
                  </p>
                  <p>
                    <strong>Description:</strong> {company.description}
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website}
                    </a>
                  </p>
                </div>
              </div>

              <div className="company-actions">
                <button
                  className="view-btn"
                  onClick={() => setSelectedCompany(company)}
                >
                  <FaEye /> Xem
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(company._id)}
                >
                  <FaTrash /> Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có công ty nào</p>
        )}
      </div>

      {/* Modal View */}
    {selectedCompany && (
  <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>Chỉnh sửa công ty</h2>

      <div className="form-group">
        <label>Tên công ty</label>
        <input
          type="text"
          value={selectedCompany.name}
          onChange={(e) =>
            setSelectedCompany({ ...selectedCompany, name: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Địa chỉ</label>
        <input
          type="text"
          value={selectedCompany.address}
          onChange={(e) =>
            setSelectedCompany({ ...selectedCompany, address: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Mô tả</label>
        <input
          type="text"
          value={selectedCompany.description}
          onChange={(e) =>
            setSelectedCompany({ ...selectedCompany, description: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Website</label>
        <input
          type="text"
          value={selectedCompany.website}
          onChange={(e) =>
            setSelectedCompany({ ...selectedCompany, website: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Avatar URL</label>
        <input
          type="text"
          value={selectedCompany.avatar}
          onChange={(e) =>
            setSelectedCompany({ ...selectedCompany, avatar: e.target.value })
          }
        />
      </div>

      <div className="modal-actions">
        <button onClick={() => setSelectedCompany(null)}>Đóng</button>
        <button
          onClick={async () => {
            try {
              await fetch(`${HOSTS.companyService}/update/${selectedCompany._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedCompany),
              });

              MySwal.fire("Thành công!", "Cập nhật công ty thành công", "success");
              setSelectedCompany(null);
              fetchCompanies(); // refresh lại danh sách
            } catch (err) {
              console.error("Error updating company:", err);
              MySwal.fire("Lỗi!", "Không thể cập nhật công ty.", "error");
            }
          }}
          className="save-btn"
        >
          Lưu
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Company;
