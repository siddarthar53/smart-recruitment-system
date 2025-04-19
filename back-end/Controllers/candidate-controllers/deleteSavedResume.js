const Resume = require("../../Models/resume.model");
const { deleteFromS3, extractS3Key } = require("../../utlis/s3Bucket.js"); // Import S3 functions

const deleteSavedResume = async (req, res) => {
  try {
    const resumeId = req.params.id;

    // Find the resume in MongoDB
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Extract S3 file key if it exists
    if (resume.s3Bucket && resume.s3Bucket.s3Url) {
      const bucketName = resume.s3Bucket.bucket;
      const s3Key = extractS3Key(resume.s3Bucket.s3Url, bucketName);

      // Delete file from S3
      const s3Response = await deleteFromS3(bucketName, s3Key);
      if (s3Response.status !== "Success") {
        return res.status(500).json({ message: "Failed to delete file from S3", error: s3Response.error });
      }
      console.log(`✅ Deleted resume file from S3: ${s3Key}`);
    }

    // Delete resume record from MongoDB
    await Resume.findByIdAndDelete(resumeId);
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = deleteSavedResume;
