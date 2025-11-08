const HOSTS = {
  userService: "http://localhost:2222/api/users",
  cvService: "http://localhost:2222/api/cvs",
  termsService: "http://localhost:2222/api/terms",
  authService: "http://localhost:1111/api/auth",
  companyService: "http://localhost:4444/api/departments",
  jobService: "http://localhost:4444/api/jobs",
  reviewService: "http://localhost:4444/api/reviews",
  application: "http://localhost:5555/api/applications",
  cvaiService: "http://localhost:8080/api/cvai",
  // forgotPasswordService: "http://localhost:5000/api/forgot-password",
  emailService: "http://localhost:5000",
  paymentService: "http://localhost:7777/api/payment",
  walletService: "http://localhost:7777/api/wallet",
  notificationService: "http://localhost:7000/api/notifications"
};

module.exports = { HOSTS };