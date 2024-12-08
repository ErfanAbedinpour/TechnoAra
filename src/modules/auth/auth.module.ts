import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "src/models/user.model";
import { HashService } from "./hashingServices/hash.service";
import { ArgonService } from "./hashingServices/argon.service";


@Module({
    imports: [MikroOrmModule.forFeature({ entities: [User] })],
    providers: [AuthService,
        {
            provide: HashService,
            useClass: ArgonService
        }
    ],
    controllers: [AuthController],
})
export class AuthModule { }
