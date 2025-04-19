const { exec } = require("child_process");
const Job = require("../Models/job");
const { downloadFromS3 } = require("../utlis/s3Bucket");
const path = require("path");
const fs = require("fs");

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const LOCAL_DOWNLOADS_FOLDER = process.env.LOCAL_DOWNLOADS_FOLDER;
const LOCAL_JOB_DESC_PATH = process.env.LOCAL_JOB_DESC_PATH;
const LOCAL_RESUMES_FOLDER = process.env.LOCAL_RESUMES_FOLDER;

// Ensure download folders exist
if (!fs.existsSync(LOCAL_RESUMES_FOLDER)) {
  fs.mkdirSync(LOCAL_RESUMES_FOLDER, { recursive: true });
}

const runPythonScript = async (req, res) => {
  try {
    const jobId= req.params.id;

    const job = await Job.findById(jobId);

    const s3OfJob = job.s3Bucket;

    console.log("s3OfJob", s3OfJob);
    res.json({ message: "s3OfJob", s3OfJob });

    // console.log("\n🔵 Starting Resume Ranking Process...");

    // if (!BUCKET_NAME) {
    //   console.error("❌ AWS_BUCKET_NAME is undefined! Check your .env file.");
    //   return res.status(500).json({ error: "AWS_BUCKET_NAME is not set in .env file" });
    // }

    // console.log("📂 Using S3 Bucket:", BUCKET_NAME);

    // // **Download Job Description**
    // const jobDescS3Key = "jobDescriptions/sample_job_description.pdf";
    // console.log("⏳ Downloading job description from S3:", jobDescS3Key);
    
    // const jobDescPath = await downloadFromS3(BUCKET_NAME, jobDescS3Key, LOCAL_JOB_DESC_PATH);
    // if (!jobDescPath) {
    //   console.error("❌ Failed to download job description");
    //   return res.status(500).json({ error: "Failed to download job description" });
    // }

    // console.log("✅ Job description downloaded successfully:", LOCAL_JOB_DESC_PATH);

    // // **Download All Resumes**
    // const resumeFiles = [
    //   "U67c93fcd632414a8e9a43739/Siddartha_s_full_stack_developer_.pdf",
    //   "U67c93fcd632414a8e9a43739/harsha_s_resume.pdf",
    //   "U67c93fcd632414a8e9a43739/jemima_s_resume.pdf",
    //   "U67c93fcd632414a8e9a43739/poojitha_s_resume.pdf",
    //   "U67c93fcd632414a8e9a43739/snehith_s_resume.pdf",
    //   "U67c93fcd632414a8e9a43739/srujith_s_resume.pdf"
    // ];

    // console.log("⏳ Downloading resumes from S3...");
    
    // for (const fileKey of resumeFiles) {
    //   const fileName = path.basename(fileKey);
    //   const resumePath = path.join(LOCAL_RESUMES_FOLDER, fileName);
      
    //   const result = await downloadFromS3(BUCKET_NAME, fileKey, resumePath);
    //   if (!result) {
    //     console.error(`❌ Failed to download resume: ${fileKey}`);
    //   } else {
    //     console.log(`✅ Resume downloaded successfully: ${resumePath}`);
    //   }
    // }

    // // **Verify All Files Exist Before Running Python Script**
    // if (!fs.existsSync(LOCAL_JOB_DESC_PATH)) {
    //   console.error("❌ Job description file is missing. Cannot proceed.");
    //   return res.status(500).json({ error: "Job description file is missing" });
    // }

    // const downloadedResumes = fs.readdirSync(LOCAL_RESUMES_FOLDER);
    // if (downloadedResumes.length === 0) {
    //   console.error("❌ No resumes found in the downloaded folder.");
    //   return res.status(500).json({ error: "No resumes downloaded" });
    // }

    // console.log(`✅ ${downloadedResumes.length} resumes ready for processing`);

    // // **Run Python Script**
    // const pythonCommand = `python scripts/Model_3.py "${LOCAL_JOB_DESC_PATH}" "${LOCAL_RESUMES_FOLDER}"`;
    
    // console.log("\n🚀 Running Python Script...");
    // console.log(`🔹 Command: ${pythonCommand}`);

    // exec(pythonCommand, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error("❌ Error executing Python script:", error);
    //     return res.status(500).json({ error: error.message, stderr, stdout });
    //   }

    //   if (stderr) {
    //     console.error("⚠️ Python Error Output:", stderr);
    //     return res.status(500).json({ error: stderr });
    //   }

    //   console.log(`✅ Python Script Output:\n${stdout}`);
    //   res.json({ message: stdout });
    // });
  } catch (error) {
    console.error("❌ Unexpected Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { runPythonScript };
