const Applicant = require('../../Models/applicants');
const Job = require('../../Models/job');
const Resume = require('../../Models/resume.model');
const Interview = require('../../Models/interview'); // Import the interview model

const getApplicantsByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const applicants = await Applicant.find({ userId });

    if (!applicants.length) {
      return res.status(404).json({ message: 'No applications found for this user' });
    }

    const results = await Promise.all(applicants.map(async (applicant) => {
      const job = await Job.findById(applicant.jobId).select('jobTitle');
      const resume = await Resume.findById(applicant.resumeId).select('resumeTitle');

      let interviewDetails = null;

      if (applicant.status.toLowerCase() === 'shortlisted') {
        // Look for interview that matches both jobId and includes this applicant's ID
        const interview = await Interview.findOne({
          jobId: applicant.jobId,
          applicantIds: applicant._id.toString()
        });

        if (interview) {
          interviewDetails = {
            interview_date: interview.interview_date,
            subject: interview.subject,
            meet_link: interview.meet_link,
            time_slot: interview.time_slot
          };
        }
      }

      return {
        jobTitle: job ? job.jobTitle : 'Job Not Found',
        resumeTitle: resume ? resume.resumeTitle : 'Resume Not Found',
        status: applicant.status,
        id: applicant._id,
        interview: interviewDetails
      };
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getApplicantsByUserId };
