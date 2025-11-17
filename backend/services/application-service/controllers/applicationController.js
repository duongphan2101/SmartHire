const Application = require("../models/Application");
const { HOSTS } = require("../../host");
const axios = require("axios");
const mongoose = require("mongoose");

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

    // Lấy email HR từ userService dựa trên createBy._id và role: "hr"
    let hrEmail, hrFullname, hrAvatar;
    if (job.createBy && job.createBy._id) {
      try {
        const hrRes = await axios.get(
          `${HOSTS.userService}/${job.createBy._id}`
        );
        const hrData = hrRes.data;
        if (hrData.role === "hr" && hrData.email) {
          hrEmail = hrData.email;
          hrFullname = hrData.fullname;
          hrAvatar = hrData.avatar;
        } else {
          console.warn(
            `User ${job.createBy._id} không phải HR (role: ${hrData.role}) hoặc không có email`
          );
          hrEmail = null;
        }
      } catch (err) {
        console.error(
          "Lỗi khi gọi userService:",
          err.message,
          err.response?.data
        );
        hrEmail = null;
      }
    } else {
      console.warn("Không tìm thấy createBy._id trong job");
      hrEmail = null;
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
        _id: user._id,
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
      await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
        receiverId: userId,
        type: "APPLY",
        title: "Ứng tuyển thành công",
        message: `Bạn đã ứng tuyển vào công việc ${job.jobTitle} tại ${job.location}`,
        requestId: ""
      });

      if (job.createBy && job.createBy._id) {
        await axios.post(process.env.NOTIFICATION_SERVICE_URL, {
          receiverId: job.createBy._id,
          type: "APPLY",
          title: "Ứng viên mới",
          message: `Ứng viên ${user.fullname} đã ứng tuyển vào vị trí ${job.jobTitle}`,
          requestId: ""
        });
      }
    } catch (notifyErr) {
      console.error("Lỗi gửi notification:", {
        message: notifyErr.message,
        response: notifyErr.response?.data,
        status: notifyErr.response?.status,
      });
    }

    let emailStatus = "Sent to user only";
    if (user.email) {
      try {
        const emailPayload = {
          user: {
            email: user.email,
            fullname: user.fullname,
          },
          hr: hrEmail ? { email: hrEmail, fullname: hrFullname || "HR" } : null,
          job: {
            title: job.jobTitle,
            location: job.location,
            salary: job.salary,
          },
        };
        const emailResponse = await axios.post(
          `${HOSTS.emailService}/api/email/notify`,
          emailPayload
        );
        emailStatus = hrEmail
          ? "Sent to both user and HR"
          : "Sent to user only";
      } catch (mailErr) {
        console.error(
          "Lỗi gửi email:",
          mailErr.response?.data || mailErr.message
        );
      }
    } else {
      console.warn("Không gửi email do thiếu user.email");
    }

    res.status(201).json({ success: true, data: application, emailStatus });
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

// Get num all application
exports.getNumApplicationByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const jobRes = await axios.get(
      `${HOSTS.jobService}/getAll/${departmentId}`
    );

    const jobs = jobRes.data;

    if (!jobs || jobs.length === 0) {
      return res.json(0);
    }

    const jobIds = jobs.map((job) => job._id);

    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    return res.json(totalApplications);
  } catch (err) {
    console.error("Error getNumApplicationByDepartment:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get num all application - by User
exports.getNumApplicationByDepartmentAndUser = async (req, res) => {
  try {
    const { departmentId, userId } = req.params;

    const jobRes = await axios.get(
      `${HOSTS.jobService}/getAll/${departmentId}`
    );

    const jobs = jobRes.data;

    if (!jobs || jobs.length === 0) {
      return res.json(0);
    }

    const jobIds = jobs.map((job) => job._id);

    // Đếm application theo jobId và userId
    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
      userId: userId, // filter thêm user
    });

    return res.json(totalApplications);
  } catch (err) {
    console.error("Error getNumApplicationByDepartmentAndUser:", err.message);
    return res.status(500).json({ message: "Server error" });
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

exports.updateStatusAndNote = async (req, res) => {
  try {
    const { status, note } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status, note },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (status === "accepted") {
      try {
        const jobId = application.jobId;
        const jobRes = await axios.get(`${HOSTS.jobService}/${jobId}`);
        const job = jobRes.data;

        if (job) {
          const currentAccepted = job.accepted || 0;
          const newAccepted = currentAccepted + 1;

          let updatePayload = {
            accepted: newAccepted
          };

          // Kiểm tra nếu đã tuyển đủ (accepted >= num) thì đóng Job
          if (job.num && newAccepted >= job.num) {
            updatePayload.status = "filled";
            console.log(`⚠️ Job ${jobId} has reached limit (${newAccepted}/${job.num}). Setting to EXPIRED.`);
          }

          // Gọi API cập nhật lại Job
          await axios.put(`${HOSTS.jobService}/${jobId}`, updatePayload);
        }
      } catch (jobError) {
        console.error("❌ Lỗi khi cập nhật số lượng Job:", jobError.message);
      }
    }

    res.json({ success: true, data: application });

  } catch (error) {
    console.error("Update App Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus_reject = async (req, res) => {
  try {
    const { canId, jobId } = req.body;
    console.log(`UPDATE: ${canId} ${jobId}`);
    const updatedApplication = await Application.findOneAndUpdate(
      { jobId: jobId, userId: canId },
      { $set: { status: "rejected" } },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn ứng tuyển"
      });
    }

    res.json({ success: true, data: updatedApplication });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};