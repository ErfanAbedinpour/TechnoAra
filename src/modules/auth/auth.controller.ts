import { Body, Controller, Post } from "@nestjs/common";
import { RegisterUserDto } from "./dtos/user.register";



@Controller('auth')
export class AuthController {
    @Post("singup")
    register(@Body() body: RegisterUserDto) { }
}