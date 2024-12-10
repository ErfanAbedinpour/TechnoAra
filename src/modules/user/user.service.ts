import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../models/user.model';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class UserService {
  private USER_NOT_FOUND = "user does not found"
  constructor(@InjectRepository(User)
  private readonly userRepository: EntityRepository<User>,) { }

  async findAll() { }

  // find user by id 
  async findOne(id: number) {
    const user = await this.userRepository.findOne({ id }, {
      populate: ["*"],
    })

    if (!user)
      throw new BadRequestException(this.USER_NOT_FOUND)

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
