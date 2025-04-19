export interface Resume {
    _id: string;
    resumeTitle: string;
    userId: string;
    personalDetails: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    education: {
      degree: string;
      institution: string;
      year: string;
      GPA: number;
    }[];
    socialMedia: {
      LinkedIn: string;
      github: string;
    };
    projects: {
      title: string;
      description: string;
    }[];
    s3Bucket: {
      status: string;
      bucket: string;
      fileName: string;
      eTag: string;
      contentType: string;
      s3Url: string;
      folder: string;
    };
    createdAt: string; // ISO string format
    updatedAt: string;
  }
  