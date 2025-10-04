import React, { useState } from "react";

interface TermsModalProps {
  onClose: () => void;
  onConfirm: (role: string) => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose, onConfirm }) => {
  const [selectedRole, setSelectedRole] = useState<"user" | "hr">("user");
  const [checked, setChecked] = useState(false);

  const candidateTerms = `
1. Phạm vi áp dụng
- Điều khoản này áp dụng cho tất cả Ứng viên khi đăng ký, tạo hồ sơ (CV), tìm kiếm, ứng tuyển việc làm trên nền tảng.

2. Quyền của Ứng viên
- Được đăng ký tài khoản miễn phí và sử dụng các tính năng tìm việc.
- Được tạo và lưu trữ hồ sơ/CV trực tuyến.
- Được ứng tuyển vào các vị trí tuyển dụng được đăng trên nền tảng.
- Được yêu cầu chỉnh sửa, ẩn hoặc xóa thông tin cá nhân bất cứ lúc nào.
- Được nền tảng bảo mật thông tin cá nhân theo chính sách bảo mật.

3. Nghĩa vụ của Ứng viên
- Cung cấp thông tin chính xác, trung thực trong hồ sơ.
- Không được: tạo nhiều tài khoản, cung cấp thông tin giả mạo, ứng tuyển thử/ảo, sử dụng dữ liệu sai mục đích, đăng tải nội dung phản cảm.

4. Bảo mật thông tin
- Ứng viên chịu trách nhiệm bảo mật tài khoản.
- Không chia sẻ mật khẩu cho bên thứ ba.
- Đồng ý rằng CV có thể được HR xem xét khi ứng tuyển hoặc bật chế độ tìm việc công khai.

5. Xử lý vi phạm
- Tài khoản vi phạm sẽ bị khóa hoặc xóa mà không cần thông báo trước.
- Nền tảng có thể hạn chế quyền truy cập nếu phát hiện gian lận.
- Vi phạm pháp luật sẽ được báo cho cơ quan chức năng.

6. Miễn trừ trách nhiệm
- Nền tảng chỉ kết nối Ứng viên và Nhà tuyển dụng.
- Không chịu trách nhiệm về kết quả phỏng vấn, tính chính xác của tin tuyển dụng, hay rủi ro từ thỏa thuận riêng.

7. Hiệu lực
- Điều khoản có hiệu lực kể từ khi đăng ký tài khoản.
- Nền tảng có quyền cập nhật, sửa đổi điều khoản và thông báo công khai.
  `;

  const hrTerms = `
1. Phạm vi áp dụng
Điều khoản này áp dụng cho tất cả Nhà tuyển dụng (HR/Doanh nghiệp/Người đại diện công ty) khi sử dụng nền tảng tuyển dụng để đăng tin, tìm kiếm và tiếp cận ứng viên.

2. Quyền của Nhà tuyển dụng
    • Được tiếp cận, tìm kiếm và tải CV ứng viên trong phạm vi dịch vụ.
    • Được nền tảng hỗ trợ kỹ thuật, chăm sóc khách hàng.
    • Được quyền yêu cầu chỉnh sửa, xóa hoặc gia hạn tin tuyển dụng trong thời gian còn hiệu lực.

3. Nghĩa vụ của Nhà tuyển dụng
    • Cung cấp thông tin chính xác, trung thực về công ty, vị trí tuyển dụng, mức lương và yêu cầu công việc.
    • Không được:
        ◦ Đăng tin tuyển dụng sai sự thật, mập mờ hoặc gây nhầm lẫn.
        ◦ Ép buộc ứng viên đóng phí để ứng tuyển hoặc tham gia phỏng vấn.
        ◦ Sử dụng dữ liệu ứng viên cho mục đích spam, quảng cáo hoặc bán cho bên thứ ba.
        ◦ Đăng tin tuyển dụng cho các công việc vi phạm pháp luật (đa cấp bất chính, cờ bạc, vay tín dụng đen, mại dâm, v.v.).
        ◦ Đăng nhiều công việc khác nhau trong cùng một tin. 
        ◦ Lạm dụng từ khóa, tên thương hiệu khác nhằm thu hút ứng viên không đúng thực tế.

4. Chính sách đăng tin tuyển dụng
    • Mỗi tin tuyển dụng chỉ áp dụng cho một vị trí cụ thể.
    • Tin đăng phải phù hợp với thuần phong mỹ tục, văn hóa, pháp luật Việt Nam.
    • Nền tảng có quyền kiểm duyệt, chỉnh sửa hoặc từ chối tin đăng nếu vi phạm tiêu chuẩn cộng đồng.
    • Tin tuyển dụng trùng lặp hoặc spam sẽ bị gỡ bỏ mà không hoàn phí.

5. Bảo mật và sử dụng dữ liệu
    • Nhà tuyển dụng phải bảo mật tài khoản và không chia sẻ cho bên thứ ba.
    • Thông tin ứng viên chỉ được sử dụng cho mục đích tuyển dụng nội bộ của doanh nghiệp.
    • Nghiêm cấm mọi hành vi mua bán, trao đổi, phát tán thông tin ứng viên trái phép.

6. Xử lý vi phạm
Trong trường hợp Nhà tuyển dụng vi phạm điều khoản:
    • Nền tảng có quyền ngừng cung cấp dịch vụ, xóa tin đăng hoặc khóa tài khoản ngay lập tức.
    • Không hoàn phí dịch vụ đã thanh toán.
    • Tùy mức độ, nền tảng có thể báo cáo cho cơ quan chức năng để xử lý theo pháp luật.

7. Miễn trừ trách nhiệm
    • Nền tảng chỉ đóng vai trò kết nối Nhà tuyển dụng và Ứng viên, không chịu trách nhiệm về quá trình phỏng vấn, ký kết hợp đồng hay quan hệ lao động sau đó.
    • Nền tảng không đảm bảo số lượng hay chất lượng ứng viên cho mỗi tin tuyển dụng.

8. Hiệu lực
    • Điều khoản này có hiệu lực kể từ ngày Nhà tuyển dụng đăng ký tài khoản và sử dụng dịch vụ.
    • Nền tảng có quyền cập nhật, sửa đổi điều khoản và sẽ thông báo trên website.
  `;

  const termsText = selectedRole === "user" ? candidateTerms : hrTerms;

  // useEffect(() => {
  //   console.log("UseEffect: ", selectedRole);
  // }, []);

  const setRole = (rolex: "user" | "hr") => {
    setSelectedRole(rolex);
    // console.log("selected: ", selectedRole);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "24px",
          width: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          position: 'relative'
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          Điều khoản sử dụng
        </h2>

        <p className="text-left text-gray-400">Chọn vai trò của bạn (*)</p>

        {/* Chọn role */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
            marginTop: "8px",
          }}
        >
          <button
            onClick={() => { setRole("user") }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: selectedRole === "user" ? "#2563eb" : "#e5e7eb",
              color: selectedRole === "user" ? "#fff" : "#000",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
            }}
          >
            Ứng viên
          </button>
          <button
            onClick={() => { setRole("hr") }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: selectedRole === "hr" ? "#10b981" : "#e5e7eb",
              color: selectedRole === "hr" ? "#fff" : "#000",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
            }}
          >
            Nhà tuyển dụng
          </button>
        </div>


        {/* Nội dung điều khoản */}
        <pre
          style={{
            background: "#f3f4f6",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "14px",
            whiteSpace: "pre-wrap",
            textAlign: "justify"
          }}
        >
          {termsText}
        </pre>

        {/* Checkbox đồng ý */}
        <div className="flex gap-1.5" style={{ marginTop: 20 }}>
          <span>Tôi đồng ý với các điều khoản</span>
          <input
            type="checkbox"
            id="agree"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="accent-emerald-600"
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            style={{
              padding: "8px 16px",
              background: "#9ca3af",
              color: "white",
              borderRadius: "6px",
              marginRight: "8px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            style={{
              padding: "8px 16px",
              background: checked ? "#16a34a" : "#9ca3af",
              color: "white",
              borderRadius: "6px",
              cursor: checked ? "pointer" : "not-allowed",
            }}
            onClick={() => onConfirm(selectedRole)}
            disabled={!checked}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
