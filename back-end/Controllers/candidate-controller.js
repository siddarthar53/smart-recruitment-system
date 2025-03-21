const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { extractResumeData } = require("../gemini-api"); // Import resume parsing function
const Resume = require("../Models/resume.model"); // Import Mongoose Resume model
const Applicant = require("../Models/applicants"); // Import Mongoose Applicant model
 
// Configure AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer to save files temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Function to check if user folder exists in S3
async function doesFolderExist(bucketName, folderKey) {
  try {
    const params = { Bucket: bucketName, Prefix: folderKey, MaxKeys: 1 };
    const command = new ListObjectsV2Command(params);
    const response = await s3.send(command);
    return response.Contents && response.Contents.length > 0;
  } catch (error) {
    console.error("❌ Error checking folder existence:", error.message);
    return false;
  }
}

// Function to upload file to S3
async function uploadToS3(filePath, fileName, bucketName, userFolder) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const contentType = "application/pdf"; // Fixed content type

    const folderExists = await doesFolderExist(bucketName, userFolder);
    if (!folderExists) {
      console.log(`📂 User directory '${userFolder}' does not exist. Creating it...`);
      await s3.send(new PutObjectCommand({ Bucket: bucketName, Key: userFolder, Body: "" }));
      console.log(`✅ User directory '${userFolder}' created successfully.`);
    }

    const fileKey = `${userFolder}${fileName}`;
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileContent,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    const response = await s3.send(command);

    return {
      status: "Success",
      bucket: bucketName,
      fileName: fileName,
      eTag: response.ETag || "N/A",
      contentType: contentType,
      s3Url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
      folder: userFolder,
    };
  } catch (error) {
    console.error("❌ Error uploading file:", error.message);
    return { status: "Failed", error: error.message };
  }
}

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

    // Parse resume with Gemini API (passing the renamed file)
    const resumeData = await extractResumeData(newFilePath);

    if (!resumeData) {
      return res.status(500).json({ error: "Failed to parse resume" });
    }

    console.log("📜 Parsed Resume Data:", resumeData);

    // Save data in MongoDB
    const newResume = new Resume({
        resumeTitle,
        userId,
        personalDetails: resumeData.personalDetails ? {
          name: resumeData.personalDetails.name || "N/A",
          email: resumeData.personalDetails.email || "N/A",
          phone: resumeData.personalDetails.phone || "N/A",
          address: resumeData.personalDetails.address || "N/A"
        } : { name: "N/A", email: "N/A", phone: "N/A", address: "N/A" }, // ✅ Default if undefined
      
        education: Array.isArray(resumeData.education) ? resumeData.education.map((edu) => ({
          degree: edu.degree || "N/A",
          institution: edu.institution || "N/A",
          year: edu.year || "N/A",
          GPA: edu.GPA || "N/A"
        })) : [], // ✅ Handle missing education array
      
        socialMedia: resumeData.socialMedia ? {
          LinkedIn: resumeData.socialMedia.LinkedIn || "N/A",
          github: resumeData.socialMedia.github || "N/A"
        } : { LinkedIn: "N/A", github: "N/A" }, // ✅ Default if undefined
      
        projects: Array.isArray(resumeData.projects) ? resumeData.projects.map((proj) => ({
          title: proj.title || "N/A",
          description: proj.description || ""
        })) : [], // ✅ Handle missing projects array
      
        s3Bucket: s3Response // Store S3 response object
      });
      
      // Save to MongoDB
      await newResume.save();
      console.log("✅ Resume saved successfully in MongoDB");
      

    // Delete temporary file after processing
    fs.unlinkSync(newFilePath);

    res.json({
      message: "Resume uploaded, parsed, and saved successfully",
      s3Response,
      resumeData,
    });
  } catch (error) {
    console.error("❌ Error in saveResume:", error.message);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};

const ApplyJob=async(req,res)=>{
  const jobID = req.params.id;
  const {resumeTitle}=req.body;
  try {
    const resume = await Resume.findOne({ resumeTitle }); // Fetch only s3Bucket field
    if (!resume) {
      console.log("No resume found with the given title.");
      return null;
    }
    try {
      const newApplicant = await Applicant.create({
        userId: resume.userId,
        resumeId: resume._id,
        jobId: jobID,
        s3Bucket: resume.s3Bucket,
      });
  
      console.log("Applicant added successfully:", newApplicant);
    } catch (error) {
      console.error("Error adding applicant:", error);
    }

  res.json({ message: "Job applied successfully" });

  } catch (error) {
    console.error("❌ Error in ApplyJob:", error.message);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
}

module.exports = { saveResume, upload,ApplyJob };
