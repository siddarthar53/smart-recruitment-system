const Resume=require("../../Models/resume.model");

const getResumesByUser = async (req, res) => {
    try{
        const userId=req.params.id; // Get userId from route params

        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        // Fetch resumes only for the authenticated user
        const savedResumes = await Resume.find({ userId });

        if (!savedResumes.length) {
        return res.status(404).json({ message: "No resumes found for this user." });
        }

        res.json(savedResumes);
    }
    catch (error) {
        console.error("❌ Error fetching resumes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = getResumesByUser;