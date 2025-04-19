const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { extractResumeData } = require("../../gemini-api");
const Resume = require("../../Models/resume.model");
const { uploadToS3 } = require("../../utlis/s3Bucket"); // Import S3 functions

// Configure Multer to save files temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
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

// **saveResume Function**
const saveResume = async (req, res) => {
  try {
    const file = req.file;
    const { resumeTitle, userId } = req.body;

    if (!file) {
      return res.status(400).json({ error: "File upload required" });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;
    const userFolder = `U${userId}/`;
    const sanitizedFileName = `${resumeTitle.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;
    const newFilePath = path.join(__dirname, "..", "uploads", sanitizedFileName);

    // Rename the uploaded file
    fs.renameSync(file.path, newFilePath);

    // Upload file to S3
    const s3Response = await uploadToS3(newFilePath, sanitizedFileName, bucketName, userFolder);

    if (s3Response.status !== "Success") {
      return res.status(500).json({ error: "S3 upload failed", details: s3Response.error });
    }

    console.log("✅ File uploaded successfully to S3:", s3Response.s3Url);

    // Parse resume with Gemini API
    const resumeData = await extractResumeData(newFilePath);

    if (!resumeData) {
      return res.status(500).json({ error: "Failed to parse resume" });
    }

    console.log("📜 Parsed Resume Data:", resumeData);

    // Save data in MongoDB
    const newResume = new Resume({
      resumeTitle,
      userId,
      personalDetails: resumeData.personalDetails || { name: "N/A", email: "N/A", phone: "N/A", address: "N/A" },
      education: Array.isArray(resumeData.education) ? resumeData.education : [],
      socialMedia: resumeData.socialMedia || { LinkedIn: "N/A", github: "N/A" },
      projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
      s3Bucket: s3Response, // Store S3 response object
    });

    await newResume.save();
    console.log("✅ Resume saved successfully in MongoDB");

    // Delete temporary file after processing
    fs.unlinkSync(newFilePath);

    res.json(newResume);
  } catch (error) {
    console.error("❌ Error in saveResume:", error.message);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};

module.exports = { saveResume, upload };