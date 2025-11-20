require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const departmentRoutes = require("./routes/departmentRoutes");
const jobRoutes = require("./routes/jobRoutes");
const companyReviewRoutes = require("./routes/companyReviewRoutes");
const reportRoutes = require("./routes/reportRoutes");
const cors = require("cors");
// const jobScheduler = require("./utils/jobScheduler");
require("./utils/jobScheduler");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/departments", departmentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reviews", companyReviewRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
