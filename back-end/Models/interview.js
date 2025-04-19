const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  applicantIds: {
    type: [String],  // Array of strings
    required: true
  },
  interview_date: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  meet_link: {
    type: String,
    required: true
  },
  time_slot: {
    type: String, // You can use a format like '10:00 AM - 11:00 AM'
    required: true
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
