const express = require("express");
const router = express.Router();
const { addJob, upload } = require("../Controllers/admin-controllers/addJob");
const viewJobs = require("../Controllers/admin-controllers/viewJobs");
const viewJob = require("../Controllers/admin-controllers/viewJob");
const deleteJob = require("../Controllers/admin-controllers/deleteJob");
const adminPage = require("../Controllers/admin-controllers/adminPage");
const getApplicants=require("../Controllers/admin-controllers/getApplicants");
const shortlistApplicants = require("../Controllers/admin-controllers/shortlistApplicants");
const saveInterview=require('../Controllers/admin-controllers/saveInterview');
const {
    getApplicantsStatusByJob,
    getScheduledInterviews
  } = require("../Controllers/admin-controllers/analytics");

// Define routes
router.get("/", adminPage);
router.post("/addJob", upload.single("jobFile"), addJob);
router.get("/viewJobs", viewJobs);
router.get("/viewJob/:id", viewJob);
router.delete("/deleteJob/:id", deleteJob);
router.post("/get-applicants/:id",getApplicants);
router.post('/shortlist', shortlistApplicants);
router.post('/save-interview', saveInterview);
router.get("/applicants-status", getApplicantsStatusByJob);
// router.get("/all-interviews", getScheduledInterviews);

module.exports = router;
