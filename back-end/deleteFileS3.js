const { deleteFromS3 } = require("./s3Bucket"); // Import the delete function

const bucketName = "sid-major-bucket"; 
const fileKey = "jobDescriptions/project_manager.pdf"; // Path inside S3

deleteFromS3(bucketName, fileKey)
  .then(response => console.log(response))
  .catch(error => console.error("Error:", error));
