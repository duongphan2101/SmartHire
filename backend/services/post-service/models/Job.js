const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobType: { type: String, required: true },
  skills: [{ type: String, required: true }],
  salary: { type: String, required: true },
  address: { type: String, required: true },
  jobDescription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const jobConnection = mongoose.createConnection(process.env.MONGO_URI_JOB);

const Job = jobConnection.model("Job", JobSchema, "jobs");

module.exports = Job;
