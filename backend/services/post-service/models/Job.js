const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    jobType: { type: String, required: true },
    jobLevel: { type: String, required: true },

    // Embed object thay vì chỉ lưu id
    department: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      avatar: { type: String, required: false },
    },

    createBy: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      fullname: { type: String, required: true },
      avatar: { type: String, required: false },
    },

    requirement: [{ type: String, required: true }],
    skills: [{ type: String, required: true }],
    benefits: [{ type: String, required: false }],
    jobDescription: [{ type: String, required: true }],

    salary: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    workingHours: { type: String, required: true },

    endDate: { type: Date, required: false },
    num: { type: Number, required: false },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const jobConnection = mongoose.createConnection(process.env.MONGO_URI_JOB);
const Job = jobConnection.model("Job", JobSchema, "jobs");

module.exports = Job;
