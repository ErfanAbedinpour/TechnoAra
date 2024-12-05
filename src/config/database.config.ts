import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
    host: process.env.PG_HOST || "localhost",
    port: +process.env.PG_PORT || 5432,
    name: process.env.PG_NAME || "TechnoAra",
    user: process.env.PG_USER || "admin",
    password: process.env.PG_PASSWORD
}))