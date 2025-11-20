// 

const HOSTS = {
  // --- Services lắng nghe trên cổng 2222 (user-service) ---
  userService: "http://user-service:2222/api/users",
  cvService: "http://user-service:2222/api/cvs",
  termsService: "http://user-service:2222/api/terms",

  // --- Services lắng nghe trên cổng 1111 (auth-service) ---
  authService: "http://auth-service:1111/api/auth",

  // --- Services lắng nghe trên cổng 4444 (post-service) ---
  companyService: "http://post-service:4444/api/departments",
  jobService: "http://post-service:4444/api/jobs",
  reviewService: "http://post-service:4444/api/reviews",
  reportService: "http://post-service:4444/api/reports",

  // --- Services lắng nghe trên cổng 5555 (application-service) ---
  application: "http://application-service:5555/api/applications",

  // --- Services lắng nghe trên cổng 8080 (cv-ai-service) ---
  cvaiService: "http://cv-ai-service:8080/api/cvai",

  // --- Dịch vụ Email (Cổng nội bộ là 5000) ---
  emailService: "http://email-service:5000/api/email",
  forgotPasswordService: "http://email-service:5080/api/forgot-password",

  // --- Services lắng nghe trên cổng 7000 (payment/notification) ---
  paymentService: "http://payment-service:7000/api/payment",
  walletService: "http://payment-service:7000/api/wallet",
  notificationService: "http://notification-service:7000/api/notifications",

  notificationSocket: "http://notification-service:7000",
  chatSocket: "http://communication-service:1000",

};

module.exports = { HOSTS };