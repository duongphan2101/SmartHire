const axios = require("axios");
const Job = require("../models/Job");
const Department = require("../models/Department");
const { HOSTS } = require("../../host");


/**
 * Create a new job
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */

const checkUserStatus = async (userId) => {
  if (!userId) {
    throw new Error("User ID không hợp lệ");
  }

  try {
    const res = await axios.get(`${HOSTS.userService}/${userId}`);
    return res.data.status; 
  } catch (err) {
    console.error("User service error:", err.response?.data || err.message);
    throw new Error("Không thể kiểm tra trạng thái user");
  }
};

const createJob = async (req, res) => {
  try {
    const jobData = req.body;

    // Kiểm tra department như cũ
    const department = await Department.findById(jobData.department?._id);
    if (!department) return res.status(404).json({ message: "Công ty không tồn tại." });
    if (department.status !== "Active") return res.status(403).json({ message: "Công ty không hoạt động" });

    // Kiểm tra HR qua User-Service
    const userStatus = await checkUserStatus(jobData.createBy._id);
    if (userStatus === "banned") {
      return res.status(403).json({ message: "Bạn đã bị admin khóa. Không thể đăng tin tuyển dụng." });
    }

    jobData.status = "pending";
    const job = new Job(jobData);
    const savedJob = await job.save();

    res.status(201).json(savedJob);

  } catch (err) {
    console.error("Job save error:", err);
    res.status(400).json({ message: err.message });
  }
};


const getJobs = async (req, res) => {
  try {
    const { idDepartment } = req.params;
    const jobs = await Job.find({ "department._id": idDepartment });
    if (jobs.length === 0) {
      return res
        .status(200)
        .json({ message: "Không có job nào cho công ty này", jobs: [] });
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNumJobsByDepartment = async (req, res) => {
  try {
    const { idDepartment } = req.params;
    const jobs = await Job.find({
      "department._id": idDepartment,
    }).countDocuments();
    if (jobs.length === 0) {
      return res
        .status(200)
        .json({ message: "Không có job nào cho công ty này", jobs: [] });
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNumJobsByUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const jobs = await Job.find({ "createBy._id": idUser }).countDocuments();
    if (jobs.length === 0) {
      return res.status(200).json({ message: "Không có job nào!", jobs: [] });
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    if (jobs.length === 0) {
      return res
        .status(200)
        .json({ message: "Không có job nào cho công ty này", jobs: [] });
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLatestJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const filterJobs = async (req, res) => {
  try {
    const { title, location, district, jobType, jobLevel, experience } =
      req.query;

    const filter = {};
    if (title) {
      filter.jobTitle = { $regex: title, $options: "i" };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (district) {
      filter["districts.name"] = { $regex: district, $options: "i" };
    }
    if (jobType) {
      filter.jobType = { $regex: jobType, $options: "i" };
    }
    if (jobLevel) {
      filter.jobLevel = { $regex: jobLevel, $options: "i" };
    }
    if (experience) {
      filter.experience = { $regex: experience, $options: "i" };
    }

    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchJobs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(200).json([]);
    }

    const jobs = await Job.find({
      $or: [
        { jobTitle: { $regex: q, $options: "i" } },
        { "createBy.fullname": { $regex: q, $options: "i" } },
      ],
    })
      .populate("createBy", "fullname avatar")
      .populate("department", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("❌ searchJobs error:", err);
    res.status(500).json({ message: err.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const categories = async (req, res) => {
  try {
    const { title } = req.query;

    const filter = {};
    if (title) {
      filter.jobTitle = { $regex: title, $options: "i" };
    }

    const jobs = await Job.find(filter);

    const response = {
      sum: jobs.length,
      data: jobs,
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSalaryStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $project: {
          createdAt: 1,
          salaryNumber: {
            $avg: {
              $map: {
                input: {
                  $split: [
                    {
                      $replaceAll: {
                        input: {
                          $replaceAll: {
                            input: "$salary",
                            find: " ",
                            replace: "",
                          },
                        },
                        find: "triệu",
                        replace: "",
                      },
                    },
                    "-",
                  ],
                },
                as: "val",
                in: { $toDouble: "$$val" },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          avgSalary: { $avg: "$salaryNumber" },
          totalJobs: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể duyệt bài ở trạng thái pending." });
    }

    job.status = "active";
    await job.save();

    res.json({ message: "Duyệt bài thành công!", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể từ chối bài ở trạng thái pending." });
    }

    job.status = "banned";
    await job.save();

    res.json({ message: "Từ chối bài đăng thành công!", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getAllJobs,
  searchJobs,
  deleteJob,
  getLatestJobs,
  updateJob,
  getJobById,
  filterJobs,
  categories,
  getNumJobsByDepartment,
  getNumJobsByUser,
  getSalaryStats,
  approveJob,
  rejectJob,
};
