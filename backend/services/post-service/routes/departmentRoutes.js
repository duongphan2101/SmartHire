const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const {getDepartments} = require('../controllers/departmentController');

router.get('/getAll', getDepartments);

module.exports = router;