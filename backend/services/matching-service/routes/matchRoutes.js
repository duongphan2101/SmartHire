import express from "express";
import { matchAllJobs, matchAllCVs, matchDepartmentJobs, matchOne } from "../controllers/matchController.js";

const router = express.Router();

// Match 1 CV – nhiều All Jobs
router.post("/match-all", matchAllJobs);
// Match 1 CV – nhiều Department All Jobs
router.post("/match-departments", matchDepartmentJobs);
// Match 1 Job – nhiều CV
router.post("/match-cvs", matchAllCVs);
// Match 1 CV – 1 Job
router.post("/match-one", matchOne);

export default router;
