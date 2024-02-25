const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { createReadStream } = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
});

// Function to upload file to S3
async function uploadFileToS3(bucketName, file) {
  const fileStream = createReadStream(file.path);
  const fileName = `${Date.now()}-Cover`;
  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileStream,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("File uploaded successfully:", data);

    return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err; // Re-throw the error to handle it in the calling function
  }
}

module.exports = {
  upload,
  uploadFileToS3,
};
