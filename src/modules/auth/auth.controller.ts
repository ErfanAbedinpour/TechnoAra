import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { RegisterUserDto, RegisterUserResponse } from "./dtos/user.register";
import { AuthService } from "./auth.service";
import { UserLoginDto, UserLoginResponse } from "./dtos/user.login";
import { LogoutDto, RefreshTokenDto, RefreshTokenResponse } from "./dtos/refresh.token.dto";
import { Auth, AUTH_STRATEGIES } from "./decorator/auth.decorator";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { LogoutResponse } from "./dtos/user-logout-response";
import { ResponseStructure } from "../../decorator/resposne-stucture.decorator";
import { HttpExceptionDto } from "../../dtos/http-exception.dto";



@Auth(AUTH_STRATEGIES.NONE)
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }

    @Post("singup")
    @ApiCreatedResponse({ description: 'user created successfully.', type: RegisterUserResponse })
    @ApiBadRequestResponse({ description: 'email is invalid.', type: HttpExceptionDto })
    register(@Body() body: RegisterUserDto): Promise<RegisterUserResponse> {
        return this.service.register(body);
    }


    @Post("login")
    @ApiOkResponse({ description: 'user logged in successfully.', type: UserLoginResponse })
    @ApiBadRequestResponse({ description: 'invalid credential.', type: HttpExceptionDto })
    @HttpCode(HttpStatus.OK)
    login(@Body() body: UserLoginDto): Promise<UserLoginResponse> {
        return this.service.login(body)
    }

    @ApiOkResponse({ description: "token successfully updated. ", type: RefreshTokenResponse })
    @ApiBody({ type: RefreshTokenDto })
    @ApiUnauthorizedResponse({ description: "token is invalid.", type: HttpExceptionDto })
    @ApiNotFoundResponse({ description: "user does not found.", type: HttpExceptionDto })
    @Post("/token")
    @HttpCode(HttpStatus.OK)
    token(@Body() body: RefreshTokenDto): Promise<RefreshTokenResponse> {
        return this.service.token(body)
    }

    @ApiOkResponse({ description: "user logout successfully", type: LogoutResponse })
    @ApiBody({ type: LogoutDto })
    @ApiBearerAuth("JWT_AUTH")
    @Auth(AUTH_STRATEGIES.BEARER)
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@Body() logoutDto: LogoutDto): Promise<LogoutResponse> {
        return this.service.logout(logoutDto);
    }
}