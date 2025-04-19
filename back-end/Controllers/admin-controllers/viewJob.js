const Job = require('../../Models/job');

const viewJob = async (req, res) => {
    try {
        const jobID = req.params.id;
        const job = await Job.findById(jobID);
        if (job) {
            return res.status(200).json(job);
        } else {
            return res.status(404).json({ message: "Job not found" });
        }
    } catch (error) {
        console.error("❌ Error retrieving job:", error.message);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
};

module.exports = viewJob;
