import { Injectable } from "@nestjs/common";
import { RefreshTokenService } from "./refreshToken.service";
import { AccessTokenService } from "./accessToken.service";
import { RedisRepository } from "../../redis/redis.repository";
import { User } from "../../../models/user.model";

@Injectable()
export class UserTokenService {

    constructor(
        private readonly refreshToken: RefreshTokenService,
        private readonly accessToken: AccessTokenService,
        private readonly redis: RedisRepository
    ) { }

    async signTokens(payload: Partial<User>): Promise<{ accessToken: string, refreshToken: string }> {
        const [accessToken, refreshToken] = await Promise.all([this.accessToken.sign(payload), this.refreshToken.sign(payload)])

        //store in redis
        await this.insert(refreshToken, payload.id);

        return { accessToken, refreshToken }
    }

    async insert(token: string, userId: number): Promise<void> {
        // save token to redis 
        await this.redis.set(this.getKey(userId, token), token);
        return;
    }

    async validate(userId: number, token: string): Promise<boolean> {
        const userToken = await this.redis.get(this.getKey(userId, token));
        return userToken === token;
    }

    async invalidate(userId: number, token: string): Promise<boolean> {
        return this.redis.del(this.getKey(userId, token));
    }

    private getKey(userId: number, token: string) {
        return `user:${userId}:${btoa(token)}`
    }
}
