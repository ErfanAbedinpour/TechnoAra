
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { RegisterUserDto, RegisterUserResponse } from "./dtos/user.register";
import { EntityManager } from "@mikro-orm/postgresql";
import { User } from "../../models/user.model";
import { UserLoginDto, UserLoginResponse } from "./dtos/user.login";
import { HashService } from "./hashingServices/hash.service";
import { AccessTokenService } from "./jwt/accessToken.service";
import { RefreshTokenService } from "./jwt/refreshToken.service";





@Injectable()
export class AuthService {
    private readonly INVALID_EMAIL = "email is registered by another user."
    private readonly INVALID_CRENDENTIAL = "email or password incorrect"
    private logger = new Logger(AuthService.name);
    constructor(
        private readonly em: EntityManager,
        private readonly hashService: HashService,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService

    ) { }


    async register({ email, username, password }: RegisterUserDto): Promise<RegisterUserResponse> {

        const isValidEmail = await this.em.findOne(User, {
            email: email,
        }, { fields: ["id", "email"] })

        if (isValidEmail)
            throw new BadRequestException(this.INVALID_EMAIL)


        this.em.create(User, { email, username, password })

        try {
            await this.em.flush();
            return { success: true }
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException();
        }
    }

    async login({ email, password }: UserLoginDto): Promise<UserLoginResponse> {
        const user = await this.em.findOne(User, { email: email }, { populate: ["role.name"], fields: ['password', "role", "profile", "email", "username"] })

        if (!user || !(await this.hashService.compare(password, user.password)))
            throw new BadRequestException(this.INVALID_CRENDENTIAL)

        // generate new token for Authorization

        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.accessTokenService.sign(user),
                this.refreshTokenService.sign(user)
            ]);
            return { accessToken, refreshToken };
        } catch (err) {
            this.logger.error(err.message)
            throw new InternalServerErrorException()
        }

    }

}