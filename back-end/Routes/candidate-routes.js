const express = require('express');
const {saveResume,upload}= require("../Controllers/candidate-controllers/save-resume.js");
const {applyJob}=require('../Controllers/candidate-controllers/applyJob.js');
const getResumesByUser = require('../Controllers/candidate-controllers/getSavedResumes.js');
const deleteSavedResume = require('../Controllers/candidate-controllers/deleteSavedResume.js');
const router = express.Router();
const {getApplicantsByUserId} = require('../Controllers/candidate-controllers/trackApplication.js');
// const {verifyToken,authorizeRole} = require("../middlewares/auth-middlewares");


router.post("/save-resume", upload.single('resumeFile'), saveResume);
router.post("/apply-job/:id", applyJob);
router.get("/get-resumes/:id",getResumesByUser);
router.delete("/delete-resume/:id", deleteSavedResume);
router.get("/track-applicants/:id", getApplicantsByUserId); // Assuming you have this function defined


module.exports = router;