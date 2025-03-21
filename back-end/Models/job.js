const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    eligibility: { type: String, required: true },
    jobType: { type: String, enum: ["Full Time", "Part Time", "Contract", "Internship"], required: true },
    jobDescription: { type: String, required: true },
    skillsRequired: { type: [String], required: true },
    noOfOpenings: { type: Number, required: true }
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
