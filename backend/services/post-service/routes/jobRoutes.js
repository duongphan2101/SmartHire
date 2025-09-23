const express = require('express');
const router = express.Router();
const { createJob, getJobs, getAllJobs , searchJobs, deleteJob, getLatestJobs,updateJob, getJobById, filterJobs} = require('../controllers/jobController');


router.post('/create', createJob);
router.get('/getAll/:idDepartment', getJobs);
router.get('/getAll', getAllJobs);
router.get('/getLatest', getLatestJobs);
router.get('/filter/search', filterJobs);
router.get('/:id', getJobById);
router.get('/search', searchJobs);
router.delete('/:id', deleteJob);
router.put('/:id', updateJob); 

module.exports = router;