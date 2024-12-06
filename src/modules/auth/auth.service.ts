import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "src/models/user.model";




@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: EntityRepository<User>
    ) { }
}