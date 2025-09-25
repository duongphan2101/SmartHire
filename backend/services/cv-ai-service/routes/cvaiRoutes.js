const express = require("express");
const { summary,
    education,
    experience,
    projects,
    skills,
    coverLetter } = require("../controllers/cvaiController");

const router = express.Router();

router.post("/summary", summary);
router.post("/education", education);
router.post("/experience", experience);
router.post("/projects", projects);
router.post("/skills", skills);
router.post("/coverLetter", coverLetter);

module.exports = router;