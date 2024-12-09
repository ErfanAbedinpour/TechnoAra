import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { RegisterUserDto, RegisterUserResponse } from "./dtos/user.register";
import { AuthService } from "./auth.service";
import { UserLoginDto, UserLoginResponse } from "./dtos/user.login";
import { RefreshTokenDto } from "./dtos/refresh.token.dto";
import { Auth, AUTH_STRATEGIES } from "./decorator/auth.decorator";



@Auth(AUTH_STRATEGIES.NONE)
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }

    @Post("singup")
    register(@Body() body: RegisterUserDto): Promise<RegisterUserResponse> {
        return this.service.register(body);
    }


    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() body: UserLoginDto): Promise<UserLoginResponse> {
        return this.service.login(body)
    }

    @Post("/token")
    @HttpCode(HttpStatus.OK)
    token(@Body() body: RefreshTokenDto) {
        return this.service.token(body)
    }
}