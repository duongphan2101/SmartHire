const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    jobType: { type: String, required: true },
    jobLevel: { type: String, required: true },

    department: { type: String, required: true },
    createBy: { type: String, required: true },

    requirement: [{ type: String, required: true }],
    skills: [{ type: String, required: true }],
    benefits: [{ type: String, required: false }],
    jobDescription: [{ type: String, required: true }],

    salary: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },

    endDate: { type: Date, required: false },
    num: { type: Number, required: false },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const jobConnection = mongoose.createConnection(process.env.MONGO_URI_JOB);
const Job = jobConnection.model("Job", JobSchema, "jobs");

module.exports = Job;
