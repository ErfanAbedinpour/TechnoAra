import { Inject, Injectable } from "@nestjs/common"
import refreshTokenConfig from "../config/refreshToken.config"
import { ConfigType } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { User } from "../../../models/user.model"

@Injectable()
export class RefreshTokenService {
    constructor(
        @Inject(refreshTokenConfig.KEY)
        private readonly configuratoin: ConfigType<typeof refreshTokenConfig>,
        private readonly jwtService: JwtService
    ) { }


    async sign(payload: Pick<User, "id">) {
        return this.jwtService.sign({
            id: payload.id,
        }, {
            secret: this.configuratoin.secret,
            expiresIn: (+this.configuratoin.expireTime * 24 * 60 * 60 * 1000 + Date.now())
        })
    }

}
