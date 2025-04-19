const Job = require('../../Models/job');

const viewJobs = async (req, res) => {
    try {
        const jobs = await Job.find({});
        if (jobs.length > 0) {
            return res.status(200).json(jobs);
        } else {
            return res.status(404).json({ message: "No jobs found" });
        }
    } catch (error) {
        console.error("❌ Error retrieving jobs:", error.message);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
};

module.exports = viewJobs;
