const express = require('express');
const router = express.Router();
const { createJob, getJobs, getAllJobs , searchJobs, deleteJob, getLatestJobs,updateJob, getJobById, filterJobs, categories
    ,getNumJobsByDepartment, getNumJobsByUser
} = require('../controllers/jobController');

router.get('/categories', categories);
router.get('/search', searchJobs);
router.post('/create', createJob);
router.get('/getAll/:idDepartment', getJobs);
router.get('/jobByDepartment/:idDepartment', getNumJobsByDepartment);
router.get('/jobByUser/:idUser', getNumJobsByUser);
router.get('/getAll', getAllJobs);
router.get('/getLatest', getLatestJobs);
router.get('/filter/search', filterJobs);
router.get('/:id', getJobById);
router.delete('/:id', deleteJob);
router.put('/:id', updateJob); 

module.exports = router;