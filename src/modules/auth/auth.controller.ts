import { Body, Controller, Post } from "@nestjs/common";
import { RegisterUserDto, RegisterUserResponse } from "./dtos/user.register";
import { AuthService } from "./auth.service";



@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }

    @Post("singup")
    register(@Body() body: RegisterUserDto): Promise<RegisterUserResponse> {
        return this.service.register(body);
    }
}