const express = require('express');
const connectDB = require('./config/db');
const departmentRoutes = require('./routes/departmentRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
// Sửa đường dẫn API cho đúng chính tả
app.use('/api/departments', departmentRoutes);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});