import { registerAs } from "@nestjs/config";



export default registerAs("refreshToken", () => ({
    secret: process.env.REFRESH_TOKEN_SECRET,
    expireTime: process.env.REFRESH_TOKEN_EXPIRE
}))