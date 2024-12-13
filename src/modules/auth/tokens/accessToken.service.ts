import { Inject, Injectable } from "@nestjs/common";
import accessTokenConfig from "../config/accessToken.config";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AccessTokenService {
    constructor(
        @Inject(accessTokenConfig.KEY)
        private readonly configuratoin: ConfigType<typeof accessTokenConfig>,
        private readonly jwtService: JwtService
    ) { }


    async sign(payload: CurentUser) {
        console.log(this.configuratoin)
        return this.jwtService.sign({
            id: payload.id,
            role: payload.role,
            username: payload.username,
            tokenId: payload.tokenId
        }, {
            secret: this.configuratoin.secret,
            expiresIn: String((+this.configuratoin.expireTime * 60 * 1000 + Date.now()))
        })
    }

    async verify(token: string): Promise<CurentUser> {
        return this.jwtService.verifyAsync<CurentUser>(token, {
            secret: this.configuratoin.secret
        })
    }
}

export class CurentUser {
    id: number
    role: string
    username: string;
    tokenId: string;
}