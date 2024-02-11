import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: "3e0a5be5a60cd6321542a72d4f0697bd",
  secretAccessKey:
    "1e5c3b9613f1f6617e26f2712658f00667a6cbf3b5147f96762f2c5af91babf1",
  endpoint: "https://5c79fff7be948c93bac0e82f57f8f003.r2.cloudflarestorage.com",
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "babar-vercel-bucket",
        Key: fileName.replace(/\\/g, '/'),
    })
    .promise();
  console.log(response);
};
