require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const departmentRoutes = require("./routes/departmentRoutes");
const jobRoutes = require("./routes/jobRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/departments", departmentRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
