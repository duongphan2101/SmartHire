const Application = require("../models/Application");

// Apply job
exports.applyJob = async (req, res) => {
  try {
    const { jobId, userId, resumeId, coverLetter } = req.body;

    const application = new Application({ jobId, userId, resumeId, coverLetter });
    await application.save();

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "User already applied this job" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all applications of a job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all applications of a user
exports.getApplicationsByUser = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update application status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
