require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const stream = require("stream");
const { promisify } = require("util");

// Configure AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to check if a folder exists in S3
async function doesFolderExist(bucketName, folderKey) {
  try {
    const params = { Bucket: bucketName, Prefix: folderKey, MaxKeys: 1 };
    const command = new ListObjectsV2Command(params);
    const response = await s3.send(command);
    return response.Contents && response.Contents.length > 0;
  } catch (error) {
    console.error("❌ Error checking folder existence:", error.message);
    return false;
  }
}

function extractS3Key(s3Url, bucketName) {
  const urlParts = new URL(s3Url);
  let s3Key = urlParts.pathname.replace(`/${bucketName}/`, ""); // Remove bucket prefix
  
  if (s3Key.startsWith("/")) {
    s3Key = s3Key.substring(1); // Remove leading slash
  }
  
  return s3Key;
}


// Function to upload a file to S3
async function uploadToS3(filePath, fileName, bucketName, folderKey) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const contentType = "application/pdf"; // Fixed content type

    const fileKey = `${folderKey}${fileName}`;
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileContent,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    const response = await s3.send(command);

    return {
      status: "Success",
      bucket: bucketName,
      fileName,
      eTag: response.ETag || "N/A",
      s3Url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
    };
  } catch (error) {
    console.error("❌ Error uploading file:", error.message);
    return { status: "Failed", error: error.message };
  }
}

// Function to download a file from S3
async function downloadFromS3(bucketName, fileKey, localPath) {
  try {
    const params = { Bucket: bucketName, Key: fileKey };
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);

    const writeStream = fs.createWriteStream(localPath);
    const pipeline = promisify(stream.pipeline);

    await pipeline(response.Body, writeStream);
    console.log(`✅ Downloaded: ${fileKey} → ${localPath}`);
    return localPath;
  } catch (error) {
    console.error(`❌ Error downloading ${fileKey} from S3:`, error.message);
    return null;
  }
}

// Function to delete a file from S3
async function deleteFromS3(bucketName, fileKey) {
  try {
    const params = { Bucket: bucketName, Key: fileKey };
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`✅ Deleted file from S3: ${fileKey}`);
    return { status: "Success", message: "File deleted successfully" };
  } catch (error) {
    console.error(`❌ Error deleting ${fileKey} from S3:`, error.message);
    return { status: "Failed", error: error.message };
  }
}

module.exports = { uploadToS3, downloadFromS3, doesFolderExist, deleteFromS3, extractS3Key };
