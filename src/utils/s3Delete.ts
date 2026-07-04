import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * @param url 
 */
export async function deleteFile(url: string): Promise<void> {
  if (!url) return;

  if (url.includes("amazonaws.com") || url.includes("s3.")) {
    try {
      const urlObj = new URL(url);
      const key = urlObj.pathname.substring(1);
      const bucket = urlObj.hostname.split(".")[0];

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
      console.log(` فایل S3 حذف شد: ${key}`);
    } catch (error) {
      console.error(`خطا در حذف فایل S3 (${url}):`, error);
    }
  } 
}

export async function deleteMultipleFiles(urls: string[]): Promise<void> {
  const deletePromises = urls.map((url) => deleteFile(url));
  await Promise.allSettled(deletePromises);
}