const express = require('express');
const router = express.Router();
const Job = require("../models/Job");

const {
  createJob, getJobs, getAllJobs, searchJobs, deleteJob,
  getLatestJobs, updateJob, getJobById, filterJobs, categories,
  getNumJobsByDepartment, getNumJobsByUser, approveJob, rejectJob
} = require('../controllers/jobController');


router.get("/count", async (req, res) => {
  try {
    const total = await Job.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stats/salary", async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $group: { _id: "$salary", totalJobs: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/stats/hot-industry", async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $group: { _id: "$department.name", totalJobs: { $sum: 1 } } },
      { $sort: { totalJobs: -1 } },
      { $limit: 5 }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/categories', categories);
router.get('/search', searchJobs);
router.post('/create', createJob);
router.get('/getAll/:idDepartment', getJobs);
router.get('/jobByDepartment/:idDepartment', getNumJobsByDepartment);
router.get('/jobByUser/:idUser', getNumJobsByUser);
router.get('/getAll', getAllJobs);

router.get("/pending", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "pending" });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getLatest', getLatestJobs);
router.get('/filter/search', filterJobs);
router.get('/:id', getJobById);
router.delete('/:id', deleteJob);
router.put('/:id', updateJob);
router.put('/approve/:id', approveJob);
router.put('/reject/:id', rejectJob);

module.exports = router;
