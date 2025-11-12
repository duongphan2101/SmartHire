// controllers/interviewController.js
const mongoose = require("mongoose");
const Interview = require("../models/Interview");

// @desc    Tạo một cuộc phỏng vấn mới
// @route   POST /api/interviews
const createInterview = async (req, res) => {
  try {
    const newInterview = new Interview(req.body);
    const savedInterview = await newInterview.save();
    res.status(201).json(savedInterview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Lấy tất cả cuộc phỏng vấn
// @route   GET /api/interviews
const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      // .populate("hrId", "name email")
      // .populate("candidateId", "name email")
      // .populate("jobId", "title");
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy một cuộc phỏng vấn bằng ID
// @route   GET /api/interviews/:id
const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const interview = await Interview.findById(id);
      // .populate("hrId", "name email")
      // .populate("candidateId", "name email")
      // .populate("jobId", "title");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật một cuộc phỏng vấn
// @route   PUT /api/interviews/:id
const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json(updatedInterview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Xóa một cuộc phỏng vấn
// @route   DELETE /api/interviews/:id
const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const deletedInterview = await Interview.findByIdAndDelete(id);

    if (!deletedInterview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.status(200).json({ message: "Interview deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export tất cả controllers
module.exports = {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
