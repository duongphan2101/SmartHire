import "./Company.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaEye, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { HOSTS } from "../../utils/host";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Company = () => {
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
            <h2>{selectedCompany.name}</h2>
            <p>
              <strong>Address:</strong> {selectedCompany.address}
            </p>
            <p>
              <strong>Description:</strong> {selectedCompany.description}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={selectedCompany.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedCompany.website}
              </a>
            </p>
            <button onClick={() => setSelectedCompany(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;
