const Application = require("../models/Application");
const { HOSTS } = require("../../host");
const axios = require("axios");

// Apply job với snapshot
exports.applyJob = async (req, res) => {
  const { jobId, userId, resumeId, coverLetter } = req.body;
  const Id = resumeId;

  try {
    const [jobRes, userRes, cvRes] = await Promise.all([
      axios.get(`${HOSTS.jobService}/${jobId}`),
      axios.get(`${HOSTS.userService}/${userId}`),
      axios.get(`${HOSTS.cvService}/cv/${Id}`),
    ]);

    const job = jobRes.data;
    const user = userRes.data;
    const cv = cvRes.data;

    if (!job || !user || !cv) {
      return res
        .status(404)
        .json({ success: false, message: "Job, User hoặc CV không tồn tại" });
    }

    // Tạo application kèm snapshot
    const application = new Application({
      jobId,
      userId,
      resumeId,
      coverLetter,
      jobSnapshot: {
        title: job.jobTitle,
        salary: job.salary,
        jobType: job.jobType,
        jobLevel: job.jobLevel,
        address: job.address,
        location: job.location,
      },
      userSnapshot: {
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
      },
      cvSnapshot: {
        fileUrls: cv.fileUrls[0],
      },
    });

    await application.save();

    try {
      await axios.post(`${HOSTS.emailService}/api/email/notify`, {
        user: {
          email: user.email,
          fullname: user.fullname,
        },
        hr: {
          email: job.createBy?.email,
          fullname: job.createBy.fullname,
        },
        job: {
          title: job.jobTitle,
          location: job.location,
          salary: job.salary,
        },
      });
    } catch (mailErr) {
      console.error("Lỗi gửi email:", mailErr.response?.data || mailErr.message);
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "User already applied this job" });
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
