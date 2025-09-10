const PORT = "192.168.1.11";

export const HOSTS = {
  userService: `http://${PORT}:2222/api/users`,
  authService: `http://${PORT}:1111/api/auth`,
  chatbotService: `http://${PORT}:3333/api/chatbot`,
  companyService: `http://${PORT}:4444/api/departments`,
  jobService: `http://${PORT}:4444/api/jobs`
};