export interface Job {
  _id: string;
  jobTitle: string;
  location: string;
  salary: string;
  eligibility: string;
  jobType: string;
  jobDescription: string;
  skillsRequired: string[]; // Array of skills
  noOfOpenings: number;
  s3Bucket: {
    status: string;
    bucket: string;
    fileName: string;
    eTag: string;
    s3Url: string;
  };
  createdAt: string; // ISO string format
  updatedAt: string;
}
