import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { RegisterUserDto, RegisterUserResponse } from "./dtos/user.register";
import { AuthService } from "./auth.service";
import { UserLoginDto, UserLoginResponse } from "./dtos/user.login";
import { RefreshTokenDto, RefreshTokenResponse } from "./dtos/refresh.token.dto";
import { Auth, AUTH_STRATEGIES } from "./decorator/auth.decorator";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";



@Auth(AUTH_STRATEGIES.NONE)
@ApiTags("auth")
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }

    @Post("singup")
    @ApiCreatedResponse({ description: 'user created successfully.', type: RegisterUserResponse })
    @ApiBadRequestResponse({ description: 'email is invalid.' })
    register(@Body() body: RegisterUserDto): Promise<RegisterUserResponse> {
        return this.service.register(body);
    }


    @Post("login")
    @ApiOkResponse({ description: 'user logged in successfully.', type: UserLoginResponse })
    @ApiBadRequestResponse({ description: 'invalid crendential.' })
    @HttpCode(HttpStatus.OK)
    login(@Body() body: UserLoginDto): Promise<UserLoginResponse> {
        return this.service.login(body)
    }

    @ApiOkResponse({ description: "token successfully updated. ", type: RefreshTokenResponse })
    @ApiUnauthorizedResponse({ description: "token is invalid." })
    @ApiNotFoundResponse({ description: "user does not found." })
    @Post("/token")
    @HttpCode(HttpStatus.OK)
    token(@Body() body: RefreshTokenDto): Promise<RefreshTokenResponse> {
        return this.service.token(body)
    }
}