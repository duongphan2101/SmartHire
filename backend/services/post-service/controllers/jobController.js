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
    const jobs = await Job.find();
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
  updateJob
};
