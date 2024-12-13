import { Injectable } from "@nestjs/common";
import { RefreshTokenService } from "./refreshToken.service";
import { AccessTokenService } from "./accessToken.service";
import { RedisRepository } from "../../redis/redis.repository";
import { User } from "../../../models/user.model";
import { v4 } from "uuid";

@Injectable()
export class UserTokenService {

    constructor(
        private readonly refreshToken: RefreshTokenService,
        private readonly accessToken: AccessTokenService,
        private readonly redis: RedisRepository
    ) { }

    async signTokens(user: Partial<User>): Promise<{ accessToken: string, refreshToken: string }> {
        const tokenId = v4();
        const [accessToken, refreshToken] = await Promise.all(
            [this.accessToken.sign({ id: user.id, role: user.role.name, tokenId: tokenId, username: user.username }),
            this.refreshToken.sign({ id: user.id, tokenId: tokenId })])

        //store in redis
        await this.insert(tokenId, user.id, refreshToken);

        return { accessToken, refreshToken }
    }

    async insert(tokenId: string, userId: number, token: string): Promise<void> {
        // save token to redis 
        await this.redis.set(this.getKey(userId, tokenId), token);
        return;
    }

    async validate(userId: number, tokenId: string, token: string): Promise<boolean> {
        const userToken = await this.redis.get(this.getKey(userId, tokenId));
        return userToken === token;
    }

    async invalidate(userId: number, tokenId: string): Promise<boolean> {
        return this.redis.del(this.getKey(userId, tokenId));
    }

    private getKey(userId: number, tokenId: string) {
        return `user:${userId}:${tokenId}`
    }
}
