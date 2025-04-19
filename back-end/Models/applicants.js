const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    resumeId: { type: String, required: true ,unique: true},
    jobId: { type: String, required: true },
    status: { type: String, enum: ["under review", "rejected", "shortlisted"], default: "under review" },
    score: { type: Number, default: 0 },
    s3Bucket: { type: Object, required: true }
}, { timestamps: true });

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;