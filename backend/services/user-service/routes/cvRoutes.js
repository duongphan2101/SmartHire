const express = require("express");
const router = express.Router();
const cvController = require("../controllers/cvController");

router.post("/createCV", cvController.createCV);
router.get("/user/:userId", cvController.getCVsByUser);
router.get("/cv/:Id", cvController.getCVById);
router.get("/all-cv", cvController.getCVs);
router.put("/:cvId", cvController.updateCV);
router.delete("/:cvId", cvController.deleteCV);
router.post("/parse-cv", cvController.parseCVText);

module.exports = router;
