const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  employees: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Active", "Suspended"],
    default: "Pending",
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
});

const Department = mongoose.model(
  "Department",
  DepartmentSchema,
  "departments"
);

module.exports = Department;
