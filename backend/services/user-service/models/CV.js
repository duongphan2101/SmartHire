const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  phone: { type: String },
  email: { type: String },
  github: { type: String },
  website: { type: String },
});

const educationSchema = new mongoose.Schema({
  university: { type: String },
  major: { type: String },
  gpa: { type: String },
  year: { type: String },
});

const experienceSchma = new mongoose.Schema({
  jobTitle: { type: String },
  company: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String },
  projectDescription: { type: String },
});

const cvSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String },
    introduction: { type: String },
    professionalSkills: { type: String },
    softSkills: { type: String },
    experience: [experienceSchma],
    certifications: { type: String },
    activitiesAwards: { type: String },

    contact: contactSchema,
    education: [educationSchema],
    projects: [projectSchema],

    fileUrls: [{ type: String }],
    status: { type: String, enum: ["draft", "active", "archived"], default: "active" },
    templateType: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CV", cvSchema);
