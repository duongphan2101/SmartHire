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

const projectSchema = new mongoose.Schema({
  projectName: { type: String },
  projectDescription: { type: String },
});

const cvSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    name: { type: String, required: true },
    introduction: { type: String },
    professionalSkills: { type: String },
    softSkills: { type: String },
    experience: { type: String },
    certifications: { type: String },
    activitiesAwards: { type: String },

    contact: contactSchema,
    education: [educationSchema],
    projects: [projectSchema],

    // optional: fileUrls nếu muốn lưu CV file
    fileUrls: [{ type: String }],
    status: { type: String, enum: ["draft", "active", "archived"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CV", cvSchema);
