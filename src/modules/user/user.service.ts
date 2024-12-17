import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, UpdateUserRespone } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../models/user.model';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Pagination } from '../../types/paggination.type';
import { GetAllUserResponse, GetOneUserResponse } from './dto/get-user-response';
import { PATH_TO_WRITE, writeToFile } from '../../uploader/writeToFile';
import { RemoveUserResponse } from './dto/remove-user.dto';
import { UserTokenService } from '../auth/tokens/user.token.service';

@Injectable()
export class UserService {

  private USER_NOT_FOUND = "user does not found"
  private INVALID_EMAIL = "email is exsist."

  private logger = new Logger(UserService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
    private readonly userTokenService: UserTokenService) { }


  async findAll({ limit, page }: Pagination): Promise<GetAllUserResponse> {

    const offset = limit * (page - 1);
    const [users, countAll] = await this.userRepository.findAndCount({}, { offset, limit });

    return {
      users,
      meta: {
        page,
        count: users.length,
        countAll,
        allPages: Math.floor(countAll / limit)
      }
    }
  }

  // find user by id 
  async findOne(id: number): Promise<GetOneUserResponse> {
    const user = await this.userRepository.findOne({ id }, {
      populate: ["*"],
    })

    if (!user)
      throw new BadRequestException(this.USER_NOT_FOUND)

    return { user };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateUserRespone> {
    const user = await this.userRepository.findOne({ id });

    // check user is exsist or not
    if (!user)
      throw new NotFoundException(this.USER_NOT_FOUND)

    for (const prop in updateUserDto) {
      if (prop === 'profile' && updateUserDto[prop]) {
        // write to dest path
        const profile = updateUserDto['profile'];
        const { filename } = await writeToFile(PATH_TO_WRITE.profile, profile);
        user[prop] = filename;
      }
      // validate email
      else if (prop === 'email' && updateUserDto[prop]) {
        const isValidEmail = await this.userRepository.findOne({ email: updateUserDto.email });
        if (isValidEmail) {
          throw new ConflictException(this.INVALID_EMAIL)
        }
      }
      else if (updateUserDto[prop] && user[prop] !== updateUserDto[prop]) {
        user[prop] = updateUserDto[prop]
      }
    }

    try {
      await this.em.flush()
      return { user };
    } catch (err) {
      await this.em.rollback();
      this.logger.error(err)
      throw new InternalServerErrorException(err.message)
    }
  }

  async remove(id: number): Promise<RemoveUserResponse> {
    const user = await this.userRepository.findOne({ id });
    if (!user)
      throw new NotFoundException(this.USER_NOT_FOUND)

    try {
      await this.em.removeAndFlush(user);
      return { isRemoved: true, user };

    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }
}
