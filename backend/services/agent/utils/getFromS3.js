// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { s3 } from "../config/s3.js";
// import { GetObjectCommand } from "@aws-sdk/client-s3";

// export const getFromS3 = async (filename, expiresIn = 600) => {
//   return await getSignedUrl(
//     s3,
//     new GetObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: filename,
//     }),
//     { expiresIn },
//   );
// };


import minioClient from "../config/minio.js";

const BUCKET = process.env.MINIO_BUCKET || "cortexai-uploads";

export const getFromS3 = async (filename, expirySeconds = 24 * 60 * 60) => {
  const url = await minioClient.presignedGetObject(BUCKET, filename, expirySeconds);
  return url;
};

// updated to use minio