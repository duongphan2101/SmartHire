const CV = require("../models/CV");
const User = require("../models/User");

// Create CV
exports.createCV = async (req, res) => {
  try {
    const { userId, cvData, pdfUrl } = req.body;
    // console.log(req.body);
    if (!userId || !cvData || !pdfUrl) return res.status(400).json({ error: "Missing data" });

    const cv = await CV.create({
      ...cvData,
      fileUrls: [pdfUrl],
      user_id: userId,
      status: "active",
    });

    await User.findByIdAndUpdate(userId, { $push: { cv: cv._id } });

    res.json({ cvId: cv._id, pdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all CVs of a user
exports.getCVsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cvs = await CV.find({ user_id: userId });
    res.json(cvs);
  } catch (err) {
    console.error("getCVsByUser error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all CVs of a user
exports.getCVById = async (req, res) => {
  try {
    const { cvId } = req.params;
    const cv = await CV.findById(cvId);
    if (!cv) return res.status(404).json({ error: "CV not found" });
    res.json(cv);
  } catch (err) {
    console.error("getCVById error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update CV
exports.updateCV = async (req, res) => {
  try {
    const { cvId } = req.params;
    const updateData = req.body;
    const cv = await CV.findByIdAndUpdate(cvId, updateData, { new: true });
    if (!cv) return res.status(404).json({ error: "CV not found" });
    res.json(cv);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete CV
exports.deleteCV = async (req, res) => {
  try {
    const { cvId } = req.params;

    const cv = await CV.findByIdAndDelete(cvId);
    if (!cv) return res.status(404).json({ error: "CV not found" });

    await User.findByIdAndUpdate(cv.user_id, { $pull: { cv: cv._id } });

    res.json({ message: "CV deleted" });
  } catch (err) {
    console.error("deleteCV error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
