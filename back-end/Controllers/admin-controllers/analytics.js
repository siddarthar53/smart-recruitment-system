const Interview = require("../../Models/interview");
const Job = require("../../Models/job");
const Applicant = require("../../Models/applicants");
const User = require("../../Models/user");

const getApplicantsStatusByJob = async (req, res) => {
    try {
      const jobs = await Job.find({});
      const applicants = await Applicant.find({});
      const users = await User.find({}, "_id name"); // fetch only _id and name
  
      // Create a lookup map for userId → name
      const userMap = {};
      users.forEach((user) => {
        userMap[user._id.toString()] = user.name;
      });
  
      const jobMap = {};
  
      for (const job of jobs) {
        jobMap[job._id.toString()] = {
          jobTitle: job.jobTitle,
          jobId: job._id,
          statusCounts: {
            shortlisted: [],
            underReview: [],
            rejected: [],
          },
        };
      }
  
      applicants.forEach((applicant) => {
        const job = jobMap[applicant.jobId];
        if (job) {
          const status = applicant.status?.toLowerCase();
          const name = userMap[applicant.userId] || "Unknown";
  
          if (status === "shortlisted") job.statusCounts.shortlisted.push(name);
          else if (status === "under review") job.statusCounts.underReview.push(name);
          else if (status === "rejected") job.statusCounts.rejected.push(name);
        }
      });
  
      res.json(Object.values(jobMap));
    } catch (err) {
      console.error("Error fetching applicants:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  

// Get all upcoming interviews
// const getScheduledInterviews = async (req, res) => {
//     try {
//       const interviews = await Interview.find({ date: { $gte: new Date() } })
//         .populate("jobId")
//         .populate("applicantId")
//         .sort({ date: 1 });
  
//       const result = interviews.map((i) => ({
//         jobTitle: i.jobId?.title || "N/A",
//         candidate: i.applicantId?.name || "N/A",
//         date: i.date,
//         location: i.location,
//       }));
  
//       res.json(result);
//     } catch (err) {
//       console.error("Error fetching interviews:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
  
  module.exports = {
    getApplicantsStatusByJob,
    // getScheduledInterviews,
  };