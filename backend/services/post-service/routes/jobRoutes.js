const express = require('express');
const router = express.Router();
const { createJob, getJobs , searchJobs, deleteJob, getLatestJobs,updateJob} = require('../controllers/jobController');


router.post('/create', createJob);
router.get('/getAll', getJobs);
router.get('/getLatest', getLatestJobs);
router.get('/search', searchJobs);
router.delete('/:id', deleteJob);
router.put('/:id', updateJob); 

module.exports = router;