import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "src/models/user.model";
import { HashService } from "./hashingServices/hash.service";
import { ArgonService } from "./hashingServices/argon.service";
import { AccessTokenService } from "./tokens/accessToken.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import accessTokenConfig from "./config/accessToken.config";
import refreshTokenConfig from "./config/refreshToken.config";
import { RefreshTokenService } from "./tokens/refreshToken.service";
import { UserTokenService } from "./tokens/user.token.service";


@Module({
    imports: [
        MikroOrmModule.forFeature({ entities: [User] }),
        JwtModule.register({}),
        ConfigModule.forRoot({ load: [accessTokenConfig, refreshTokenConfig] }),
    ],
    providers: [AuthService,
        {
            provide: HashService,
            useClass: ArgonService
        },
        AccessTokenService,
        RefreshTokenService,
        UserTokenService
    ],
    controllers: [AuthController],
})
export class AuthModule { }
