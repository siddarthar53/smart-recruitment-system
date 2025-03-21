export interface Job {
    _id: string;
    jobTitle: string;
    jobType: string;
    location: string;
    salary: string;
    eligibility: string;
    jobDescription: string;
    skillsRequired: string[]; // Array of strings
    noOfOpenings: number;
    createdAt: string;
    updatedAt: string;
  }
  