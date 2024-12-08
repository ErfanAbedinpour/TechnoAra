import { Inject, Injectable } from "@nestjs/common";
import accessTokenConfig from "../config/accessToken.config";
import { ConfigType } from "@nestjs/config";
import { User } from "../../../models/user.model";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AccessTokenService {
    constructor(
        @Inject(accessTokenConfig.KEY)
        private readonly configuratoin: ConfigType<typeof accessTokenConfig>,
        private readonly jwtService: JwtService
    ) { }


    async sign(payload: Partial<User>) {
        console.log(this.configuratoin)
        return this.jwtService.sign({
            id: payload.id,
            role: payload.role.name,
            username: payload.username
        }, {
            secret: this.configuratoin.secret,
            expiresIn: (+this.configuratoin.expireTime * 60 * 1000 + Date.now())
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
    username: string
}