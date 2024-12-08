
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { RegisterUserDto, RegisterUserResponse } from "./dtos/user.register";
import { EntityManager } from "@mikro-orm/postgresql";
import { User } from "../../models/user.model";




@Injectable()
export class AuthService {
    private readonly INVALID_EMAIL = "email is registered by another user."
    private logger = new Logger(AuthService.name);
    constructor(
        private readonly em: EntityManager
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
            throw new InternalServerErrorException(err.message);
        }
    }
}