import { Module } from "@nestjs/common";
import { RedisRepository } from "./redis.repository";

@Module({
    exports: [RedisRepository],
    providers: [RedisRepository],
})
export class ReidsModule {
}