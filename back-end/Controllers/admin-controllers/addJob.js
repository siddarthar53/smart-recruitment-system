const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadToS3 } = require("../../utlis/s3Bucket"); // Import S3 functions
const Job = require("../../Models/job");

// Configure Multer to save files temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// **addJob Function**
const addJob = async (req, res) => {
  try {
    const file = req.file;
    const { jobTitle, location, salary, eligibility, jobType, jobDescription, skillsRequired } = req.body;
    let noOfOpenings = Number(req.body.noOfOpenings) || 1;  // Default to 1 if missing
    
    if (!file) {
      return res.status(400).json({ error: "File upload required" });
    }
    console.log("Received Data:", req.body);
    console.log("Received File:", req.file);


    const bucketName = process.env.AWS_BUCKET_NAME;
    const jobFolder = `jobDescriptions/`; // Folder in S3
    const sanitizedFileName = `${jobTitle.replace(/[^a-zA-Z0-9-_]/g, "_")}.docx`;
    const newFilePath = path.join(__dirname, "..", "..", "uploads", sanitizedFileName);

    // Rename the uploaded file
    fs.renameSync(file.path, newFilePath);

    // Upload file to S3
    const s3Response = await uploadToS3(newFilePath, sanitizedFileName, bucketName, jobFolder);

    if (s3Response.status !== "Success") {
      return res.status(500).json({ error: "S3 upload failed", details: s3Response.error });
    }

    console.log("✅ Job description uploaded successfully to S3:", s3Response.s3Url);

    // Save job details in MongoDB
    const newJob = new Job({
      jobTitle,
      location,
      salary,
      eligibility,
      jobType,
      jobDescription,
      skillsRequired: skillsRequired.split(",").map(skill => skill.trim()), // Convert CSV string to array
      noOfOpenings: Number(noOfOpenings),
      s3Bucket: s3Response // Store S3 response details
    });

    await newJob.save();
    console.log("✅ Job details saved successfully in MongoDB");

    // Delete temporary file after processing
    fs.unlinkSync(newFilePath);

    res.json({
      message: "Job added successfully",
      job: newJob
    });
  } catch (error) {
    console.error("❌ Error in addJob:", error.message);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};

module.exports = { addJob, upload };
