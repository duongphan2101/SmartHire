const mongoose = require('mongoose');

const DepartmentSchema  = new mongoose.Schema({
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
});

const Department = mongoose.model('Department', DepartmentSchema, 'departments'); 

module.exports = Department;