const TermsContent = require("../models/TermsContent");

const getTermsContent = async (req, res) => {
  const { role } = req.params;

  if (!role || !["user", "hr"].includes(role.toLowerCase())) {
    return res.status(400).json({
      message: "Thiếu vai trò. Vui lòng thêm /user hoặc /hr vào URL.",
    });
  }

  try {
    const termsDoc = await TermsContent.findOne({ role: role.toLowerCase() });

    if (!termsDoc) {
      return res.status(404).json({
        message: `Không tìm thấy điều khoản cho vai trò: ${role}`,
      });
    }

    return res.status(200).json({
      success: true,
      role: termsDoc.role,
      content: termsDoc.content,
    });
  } catch (error) {
    console.error("❌ Lỗi khi truy vấn điều khoản:", error);
    res.status(500).json({
      message: "Lỗi Server khi truy vấn nội dung điều khoản.",
    });
  }
};

const updateTermsContent = async (req, res) => {
  const { role } = req.params;
  const { content } = req.body;

  if (!role || !["user", "hr"].includes(role.toLowerCase())) {
    return res.status(400).json({
      message: "Thiếu vai trò hợp lệ (user hoặc hr).",
    });
  }

  if (!content) {
    return res.status(400).json({
      message: "Nội dung điều khoản không được để trống.",
    });
  }

  try {
    const updated = await TermsContent.findOneAndUpdate(
      { role: role.toLowerCase() },
      { content },
      { new: true, upsert: true } // nếu chưa có thì tạo mới
    );

    res.status(200).json({
      success: true,
      message: `Cập nhật điều khoản ${role} thành công.`,
      data: updated,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật điều khoản:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật điều khoản." });
  }
};
module.exports = { getTermsContent, updateTermsContent };
