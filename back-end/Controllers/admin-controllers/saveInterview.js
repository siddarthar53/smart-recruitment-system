const Interview = require('../../Models/interview');
const Job = require('../../Models/job');

const saveInterview = async (req, res) => {
  try {
    const { jobTitle, applicantIds, interviewDate, emailSubject, googleMeetLink, timeSlot } = req.body;

    if (!jobTitle || !applicantIds || !interviewDate || !emailSubject || !googleMeetLink || !timeSlot) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.findOne({ jobTitle }).select('_id');
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const newInterview = new Interview({
      jobId: job._id,
      applicantIds,
      interview_date: interviewDate,
      subject: emailSubject,
      meet_link: googleMeetLink,
      time_slot: timeSlot,
    });

    await newInterview.save();
    res.status(201).json({ message: "Interview saved successfully", interview: newInterview });

  } catch (error) {
    console.error("Error saving interview:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = saveInterview;
