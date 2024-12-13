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
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./gurad/auth.guard";
import { AccessTokenGuard } from "./gurad/access-token.guard";
import { RoleGurad } from "./gurad/role.guard";


@Module({
    imports: [
        JwtModule.register({}),
        ConfigModule.forRoot({ load: [accessTokenConfig, refreshTokenConfig] }),
    ],
    exports: [UserTokenService],
    providers: [AuthService,
        {
            provide: HashService,
            useClass: ArgonService
        },
        AccessTokenService,
        RefreshTokenService,
        UserTokenService,
        AccessTokenGuard,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        {
            provide: APP_GUARD,
            useClass: RoleGurad
        }
    ],
    controllers: [AuthController],
})
export class AuthModule { }
