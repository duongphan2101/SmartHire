const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const {getDepartments, findDepartmentByUserId} = require('../controllers/departmentController');

router.get('/getAll', getDepartments);
router.get("/user/:userId", findDepartmentByUserId);

module.exports = router;