const Applicant = require("../../Models/applicants");
const Resume = require("../../Models/resume.model");

const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id; // Get jobId from route params
    const { userId, resumeId } = req.body; // Get userId and resumeId from request body

    if (!userId || !resumeId || !jobId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch resume details to get s3Bucket data
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    
    // Create a new applicant entry
    const newApplicant = new Applicant({
      userId,
      resumeId,
      jobId,
      s3Bucket: resume.s3Bucket 
    });

    await newApplicant.save();
    console.log("✅ Applicant data saved successfully");

    res.status(201).json({ message: "Job application submitted successfully", applicant: newApplicant });
  } catch (error) {
    console.error("❌ Error in applyJob:", error.message);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};

module.exports = { applyJob };
