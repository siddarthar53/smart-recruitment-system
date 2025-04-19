export interface Applicant {
    _id: string;
    userId: string;
    resumeId: string;
    jobId: string;
    status: "under review" | "rejected" | "shortlisted"; // Enum for status
    s3Bucket: {
      status: string;
      bucket: string;
      fileName: string;
      eTag: string;
      contentType: string;
      s3Url: string;
      folder: string;
    };
    createdAt: string; // Using string for timestamps (ISO format)
    updatedAt: string;
}
  