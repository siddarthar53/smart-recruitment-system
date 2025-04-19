const Applicant = require("../../Models/applicants");
const User = require("../../Models/user");
const Resume = require("../../Models/resume.model");
const Job = require("../../Models/job");
const { extractS3Key, downloadFromS3 } = require("../../utlis/s3Bucket");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const s3OfJob = job.s3Bucket;
    const s3KeyOfJob = extractS3Key(s3OfJob.s3Url, s3OfJob.bucket);

    console.log("s3KeyOfJob", s3KeyOfJob);

    const jobDescPath = await downloadFromS3(process.env.AWS_BUCKET_NAME, s3KeyOfJob, process.env.LOCAL_JOB_DESC_PATH);
    if (!jobDescPath) {
      console.error("❌ Failed to download job description");
      return res.status(500).json({ error: "Failed to download job description" });
    }

    console.log("✅ Job description downloaded successfully:", process.env.LOCAL_JOB_DESC_PATH);

    const oldPath = process.env.LOCAL_JOB_DESC_PATH;
    const newPath = oldPath.replace(".pdf", ".docx");
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Renamed job description file to .docx: ${newPath}`);

    const applicants = await Applicant.find({ jobId });

    const resumes3Urls = applicants.map(applicant => applicant.s3Bucket.s3Url);
    const resumeNames = applicants.map(applicant => applicant.userId);

    console.log("Resumes S3 URLs:", resumes3Urls);

    for (let i = 0; i < resumes3Urls.length; i++) {
      const resumes3Url = resumes3Urls[i];
      const fileKey = extractS3Key(resumes3Url, process.env.AWS_BUCKET_NAME);
      const fileName = `${resumeNames[i]}.pdf`;
      const resumePath = path.join(process.env.LOCAL_RESUMES_FOLDER, fileName);

      const result = await downloadFromS3(process.env.AWS_BUCKET_NAME, fileKey, resumePath);
      if (!result) {
        console.error(`❌ Failed to download resume: ${fileKey}`);
      } else {
        console.log(`✅ Resume downloaded successfully as ${fileName}`);
      }
    }

    const downloadedResumes = fs.readdirSync(process.env.LOCAL_RESUMES_FOLDER);
    if (downloadedResumes.length === 0) {
      console.error("❌ No resumes found in the downloaded folder.");
      return res.status(500).json({ error: "No resumes downloaded" });
    }

    console.log(`✅ ${downloadedResumes.length} resumes ready for processing`);

    // Run Python Script
    const pythonCommand = `python scripts/Model_3.py "${newPath}" "${process.env.LOCAL_RESUMES_FOLDER}"`;
    console.log("\n🚀 Running Python Script...");
    console.log(`🔹 Command: ${pythonCommand}`);

    exec(pythonCommand, async (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error executing Python script:", error);
        return res.status(500).json({ error: error.message, stderr, stdout });
      }

      if (stderr) {
        console.error("⚠️ Python Error Output:", stderr);
        return res.status(500).json({ error: stderr });
      }

      try {
        const rankedData = JSON.parse(stdout);

        let rankedArray = Object.entries(rankedData).map(([filename, score]) => {
          const userId = filename.replace(".pdf", "");
          return { filename, score, userId };
        });

        rankedArray.sort((a, b) => b.score - a.score);

        const userIds = rankedArray.map(item => item.userId);

        // Step 1: Update score in DB
        for (const applicant of rankedArray) {
          await Applicant.findOneAndUpdate(
            { userId: applicant.userId, jobId },
            { $set: { score: applicant.score } }
          );
        }

        // Step 2: Fetch updated applicants
        const updatedApplicants = await Applicant.find({ jobId });

        const updatedUserIds = updatedApplicants.map(app => app.userId);
        const updatedUsers = await User.find({ _id: { $in: updatedUserIds } });

        // Step 3: Build userId → user data map
        const userMap = {};
        updatedUsers.forEach(user => {
          userMap[user._id.toString()] = {
            name: user.name,
            email: user.email
          };
        });

        // Step 4: Merge applicant with user data
        const combinedApplicants = updatedApplicants.map(applicant => {
          const userInfo = userMap[applicant.userId] || {};
          return {
            ...applicant.toObject(),
            name: userInfo.name || "Unnamed",
            email: userInfo.email || "Not Available"
          };
        });

        // Optional: Sort by score
        combinedApplicants.sort((a, b) => b.score - a.score);

        console.log("✅ Final Combined Applicants:", combinedApplicants);
        res.status(200).json(combinedApplicants);

      } catch (parseError) {
        console.error("❌ Failed to parse Python output:", parseError);
        return res.status(500).json({ error: "Failed to parse Python output" });
      }
    });

    if (!applicants.length) {
      return res.status(404).json({ message: "No applicants found for this job" });
    }
  } catch (error) {
    console.error("❌ Error in getApplicants:", error.message);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};

module.exports = getApplicants;
