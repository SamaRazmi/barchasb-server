const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});

exports.uploadToLiara = async (file, userId) => {
  if (!file) return null;
  
  const fileName = `resumes/${userId}/resume-${Date.now()}${path.extname(file.originalname)}`;
  
  const params = {
    Body: file.buffer,
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: fileName,
    ContentType: file.mimetype, 
    // ACL: 'public-read', 
    };

  try {
    await s3.send(new PutObjectCommand(params));

    return `${process.env.LIARA_ENDPOINT2}/${fileName}`;
  } catch (error) {
    console.error("Error uploading to Liara S3:", error);
    throw new Error("خطا در آپلود فایل رزومه");
  }
};
