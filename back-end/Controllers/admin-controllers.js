const Job = require('../Models/job');

const adminPage = (req, res) => {
    res.json({
        message: "Welcome Admin!",
        user: req.user // Display user details from the token
    });
}

const addJob =async (req, res) => {
    // Add a new job to the database
    const {title,location,salary,eligibility,type,description,skills,openings} = req.body;
    const jobAdded= await Job.create({jobTitle:title,location,salary,eligibility,jobType:type,jobDescription:description,skillsRequired:skills,noOfOpenings:openings});
    if(jobAdded){
        return res.status(201).json({message:"Job added successfully"});
    }
    else{
        return res.status(500).json({message:"Failed to add job"});
    }
}

const viewJobs = async (req, res) => {
    // View all jobs from the database
    const jobs = await Job.find({});
    if(jobs){
        return res.status(200).json({jobs});
    }
    else{
        return res.status(404).json({message:"No jobs found"});
    }
}

const viewJob = async (req, res) => {
    // View a specific job from the database
    const jobID = req.params.id;
    const job = await Job.findById(jobID);
    if(job){
        return res.status(200).json(job);
    }
    else{
        return res.status(404).json({message:"Job not found"});
    }
}

const deleteJob = async (req, res) => {
    // Delete a specific job from the database
    const jobID = req.params.id;
    const job = await Job.findByIdAndDelete(jobID);
    if(job){
        return res.status(200).json({message:"Job deleted successfully"});
    }
    else{
        return res.status(404).json({message:"Job not found"});
    }
}

module.exports = {
    adminPage,
    addJob,
    viewJobs,
    viewJob,
    deleteJob
};