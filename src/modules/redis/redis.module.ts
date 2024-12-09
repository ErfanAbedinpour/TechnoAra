import { Global, Module } from "@nestjs/common";
import { RedisRepository } from "./redis.repository";

@Global()
@Module({
    exports: [RedisRepository],
    providers: [RedisRepository],
})
export class ReidsModule {
}