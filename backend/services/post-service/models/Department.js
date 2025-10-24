const mongoose = require('mongoose');

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
      required: true
    }
  ],
  status: {
        type: String,
        enum: ['Active', 'Suspended', 'Archived'], 
        default: 'Active',
        required: true,
    }

});

const Department = mongoose.model('Department', DepartmentSchema, 'departments');

module.exports = Department;