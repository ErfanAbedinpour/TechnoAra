
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { RegisterUserDto } from "./dtos/user.register";
import { EntityManager } from "@mikro-orm/postgresql";
import { User } from "../../models/user.model";




@Injectable()
export class AuthService {
    private readonly INVALID_EMAIL = "email is registered by another user."
    private logger = new Logger(AuthService.name);
    constructor(
        private readonly em: EntityManager
    ) { }


    async register({ email, username, password }: RegisterUserDto) {

        const isValidEmail = await this.em.findOne(User, {
            email,
        }, { populate: ["id", 'email'] })

        if (isValidEmail)
            throw new BadRequestException(this.INVALID_EMAIL)

        const user = new User()
        user.email = email;
        user.password = password;
        user.username = username;

        try {
            await this.em.persistAndFlush(user);
            return true;
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException(err.message);
        }
    }
}