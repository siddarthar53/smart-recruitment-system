const express = require('express');
const {saveResume,upload,ApplyJob}= require("../Controllers/candidate-controller");
const router = express.Router();
// const {verifyToken,authorizeRole} = require("../middlewares/auth-middlewares");


router.post("/save-resume", upload.single('resumeFile'), saveResume);
router.post("/apply-job/:id", ApplyJob);


module.exports = router;