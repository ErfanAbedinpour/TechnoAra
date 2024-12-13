import { Injectable } from "@nestjs/common";
import { RedisRepository } from "../../redis/redis.repository";

@Injectable()
export class BlackListService {
    constructor(private readonly redis: RedisRepository) { }


    async setToBlackList(token: string, ttl?: number): Promise<void> {
        await this.redis.set(this.getKey(token), 'true', ttl ? ttl : 30 * 60);
        return;
    }

    async isInBlackList(token: string): Promise<boolean> {
        const res = await this.redis.get(this.getKey(token))
        return !!res
    }


    private getKey(token: string) {
        return `blacklist:${token}`
    }



}