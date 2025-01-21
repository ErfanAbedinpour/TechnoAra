import { registerAs } from "@nestjs/config";

export default registerAs("Storage", () => ({
    endpoint: process.env["STORAGE_END_POINT"],
    accessKey: process.env["STORAGE_ACCESS_KEY"],
    secretKey: process.env["STORAGE_SECRET_KEY"]
}))