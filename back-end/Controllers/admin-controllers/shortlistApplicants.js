const Applicant = require('../../Models/applicants')

const shortlistApplicants = async (req, res) => {
    try {
        const { applicantIds, jobId } = req.body;

        if (!applicantIds || !Array.isArray(applicantIds) || !jobId) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        // 1. Update selected applicants to 'shortlisted'
        await Applicant.updateMany(
            { _id: { $in: applicantIds }, jobId },
            { $set: { status: "shortlisted" } }
        );

        // 2. Update other applicants of the same job to 'rejected'
        await Applicant.updateMany(
            { _id: { $nin: applicantIds }, jobId },
            { $set: { status: "rejected" } }
        );

        return res.status(200).json({ message: "Applicants updated successfully" });

    } catch (error) {
        console.error("Error in shortlistApplicants:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = shortlistApplicants;
