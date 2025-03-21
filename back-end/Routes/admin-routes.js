const {adminPage,addJob,viewJob,viewJobs,deleteJob} = require('../Controllers/admin-controllers');
const express = require('express');
const router = express.Router();
//const {verifyToken,authorizeRole} = require("../middlewares/auth-middlewares");

router.get("/",adminPage);
router.post("/addJob",addJob);
router.get("/viewJobs",viewJobs);
router.get("/viewJob/:id",viewJob);
router.delete("/deleteJob/:id",deleteJob);
 
module.exports = router;