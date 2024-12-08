import { registerAs } from "@nestjs/config";


export default registerAs("accessToken", () => ({
    secret: process.env.ACCESS_TOKEN_SECRET,
    expireTime: process.env.ACCESS_TOKEN_EXPIRE
}))