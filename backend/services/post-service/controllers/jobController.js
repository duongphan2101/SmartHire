const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const jobData = req.body;
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
      return res.status(200).json({ message: "Không có job nào cho công ty này", jobs: [] });
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getLatestJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
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
    const { title, location } = req.query;

    const filter = {};
    if (title) {
      filter.jobTitle = { $regex: title, $options: "i" };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchJobs = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json(await Job.find());
    }

    const jobs = await Job.find({
      $or: [
        { jobTitle: { $regex: query, $options: "i" } },
        { skills: { $regex: query, $options: "i" } },
      ],
    });

    res.json(jobs);
  } catch (err) {
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

module.exports = {
  createJob,
  getJobs,
  searchJobs,
  deleteJob,
  getLatestJobs,
  updateJob,
  getJobById,
  filterJobs
};
