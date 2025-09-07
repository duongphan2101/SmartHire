const express = require('express');
const router = express.Router();
const { createJob, getJobs , searchJobs, deleteJob} = require('../controllers/jobController');


router.post('/create', createJob);
router.get('/getAll', getJobs);
router.get('/search', searchJobs);
router.delete('/:id', deleteJob);

module.exports = router;