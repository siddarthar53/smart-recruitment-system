const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Resume= require('./models/resume.model.js')
const extractResumeData =require('./gemini-api.js');

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://madgulasiddarthareddy:GWPrIQS20KTPd4iu@cluster0.3xgqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected!');
    app.listen(3000,()=>{
        console.log("server listening on port 3000")
    });
}).catch(()=>{
    console.log('connection failed')
});

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// File Upload Endpoint
app.post('/upload-resume', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    console.log("Uploaded File Path:", req.file.path);

    // Call Gemini API for resume parsing
    const resumeDataString = await extractResumeData(req.file.path);
    if (!resumeDataString) {
      return res.status(500).json({ message: "Failed to extract resume data." });
    }

    const parsedData = JSON.parse(resumeDataString);

    // Save to MongoDB
    const formattedData = {
      personalDetails: parsedData["personal-details"],
      education: parsedData["education"],
      socialMedia: parsedData["social-media"],
      projects: parsedData["projects"]
    };

    const resume = await Resume.create(formattedData);
    console.log("Resume saved:", resume);
    
    res.status(200).json({ message: "File uploaded & resume extracted successfully", resume });
  } catch (error) {
    console.error("Error in file upload:", error);
    res.status(500).json({ message: error.message });
  }
});