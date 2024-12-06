import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "src/models/user.model";


@Module({
    imports: [MikroOrmModule.forFeature({ entities: [User] })],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
