const Job = require("../../Models/job");
const { deleteFromS3, extractS3Key } = require("../../utlis/s3Bucket");

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    // Find the job in MongoDB
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Extract S3 file key if it exists
    if (job.s3Bucket && job.s3Bucket.s3Url) {
      const bucketName = job.s3Bucket.bucket;
      const s3Key = extractS3Key(job.s3Bucket.s3Url, bucketName);

      // Delete file from S3
      const s3Response = await deleteFromS3(bucketName, s3Key);
      if (s3Response.status !== "Success") {
        return res.status(500).json({ message: "Failed to delete file from S3", error: s3Response.error });
      }
      console.log(`✅ Deleted job file from S3: ${s3Key}`);
    }

    // Delete job record from MongoDB
    await Job.findByIdAndDelete(jobId);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = deleteJob;
