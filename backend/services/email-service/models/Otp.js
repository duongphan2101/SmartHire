const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    minlength: [6, 'OTP must be 6 digits'],
    maxlength: [6, 'OTP must be 6 digits']
  },
  expireAt: {
    type: Date,
    required: true,
    expires: '10m'  // TTL index tự động xóa sau 10 phút
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Compound indexes
otpSchema.index({ email: 1, expireAt: 1 });
otpSchema.index({ otp: 1, expireAt: 1 });

// TTL index cho expireAt (Atlas tự động tạo khi có expires: '10m')
module.exports = mongoose.model('Otp', otpSchema);