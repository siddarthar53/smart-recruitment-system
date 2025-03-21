const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    resumeId: { type: String, required: true },
    jobId: { type: String, required: true },
    s3Bucket: { type: Object, required: true },
    status: { type: String, default: "Applied" }
}, { timestamps: true });

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;
