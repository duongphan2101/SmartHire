const express = require('express');
const router = express.Router();
const { createJob, getJobs, getAllJobs , searchJobs, deleteJob, getLatestJobs,updateJob, getJobById, filterJobs, categories} = require('../controllers/jobController');

router.get('/categories', categories);
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