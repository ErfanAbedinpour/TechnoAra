import { registerAs } from "@nestjs/config";

export default registerAs("Storage", () => ({
    endpoint: process.env["S3_END_POINT_URL"],
    accessKey: process.env["S3_ACCESS_KEY"],
    secretKey: process.env["S3_SECRET_KEY"],
    bucketName: process.env["S3_BUCKET_NAME"]
}))