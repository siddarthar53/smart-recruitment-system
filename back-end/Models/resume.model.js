const mongoose = require("mongoose");

// Define Sub-Schemas
const PersonalDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  GPA: { type: mongoose.Schema.Types.Mixed } // Mixed type to allow string/number
});

const SocialMediaSchema = new mongoose.Schema({
  LinkedIn: { type: String },
  github: { type: String }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
});

// Main Resume Schema
const ResumeSchema = new mongoose.Schema(
  {
    resumeTitle: { type: String, required: true },
    userId: { type: String, required: true }, // User ID associated with the resume
    personalDetails: { type: PersonalDetailsSchema, required: true },
    education: { type: [EducationSchema], required: true },
    socialMedia: { type: SocialMediaSchema, required: true },
    projects: { type: [ProjectSchema], required: true },
    s3Bucket: { type: Object, required: true } // S3 bucket link or identifier
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);
