
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RegisterUserDto, RegisterUserResponse } from "./dtos/user.register";
import { EntityManager } from "@mikro-orm/postgresql";
import { User } from "../../models/user.model";
import { UserLoginDto, UserLoginResponse } from "./dtos/user.login";
import { HashService } from "./hashingServices/hash.service";
import { UserTokenService } from "./tokens/user.token.service";
import { RefreshTokenDto } from "./dtos/refresh.token.dto";
import { RefreshTokenService } from "./tokens/refreshToken.service";





@Injectable()
export class AuthService {
    private readonly INVALID_EMAIL = "email is registered by another user."
    private readonly INVALID_CRENDENTIAL = "email or password incorrect"
    private readonly INVALID_REFRESH_TOKEN = "token is invaid"
    private readonly USER_NOT_FOUND = "user does not found";
    private logger = new Logger(AuthService.name);
    constructor(
        private readonly em: EntityManager,
        private readonly hashService: HashService,
        private readonly userToken: UserTokenService,
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
            const { accessToken, refreshToken } = await this.userToken.signTokens(user);
            return { accessToken, refreshToken }
        } catch (err) {
            this.logger.error(err.message)
            throw new InternalServerErrorException()
        }
    }


    async token({ refreshToken: token }: RefreshTokenDto) {
        const { id } = await this.refreshTokenService.verify(token);

        const isValidate = await this.userToken.validate(id, token);

        if (!isValidate)
            throw new UnauthorizedException(this.INVALID_REFRESH_TOKEN)

        await this.userToken.invalidate(id, token);

        const user = await this.em.findOne(User, { id: id });

        if (!user)
            throw new BadRequestException(this.USER_NOT_FOUND)

        try {
            const { accessToken, refreshToken } = await this.userToken.signTokens(user);

            return { accessToken, refreshToken }

        } catch (err) {
            this.logger.error(err.message)
            throw new InternalServerErrorException()
        }
    }
}