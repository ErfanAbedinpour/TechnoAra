import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto, RegisterUserResponse } from './dtos/user.register';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../../models/user.model';
import { UserLoginDto, UserLoginResponse } from './dtos/user.login';
import { HashService } from './hashingServices/hash.service';
import { UserTokenService } from './tokens/user.token.service';
import { RefreshTokenDto } from './dtos/refresh.token.dto';
import { RefreshTokenService } from './tokens/refreshToken.service';
import { Role } from './decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { JsonWebTokenError } from '@nestjs/jwt';
import { BlackListService } from './blacklist/blacklist.service';
import { LogoutResponse } from './dtos/user-logout-response';

@Injectable()
export class AuthService {
  private readonly INVALID_EMAIL = 'email is registered by another user.';
  private readonly INVALID_CRENDENTIAL = 'email or password incorrect';
  private readonly INVALID_REFRESH_TOKEN = 'token is invaid';
  private readonly USER_NOT_FOUND = 'account not found.';
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly em: EntityManager,
    private readonly hashService: HashService,
    private readonly userToken: UserTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly blackList: BlackListService,
  ) {}

  async register({
    email,
    username,
    password,
  }: RegisterUserDto): Promise<RegisterUserResponse> {
    const isValidEmail = await this.em.findOne(
      User,
      {
        email: email,
      },
      { fields: ['id', 'email'] },
    );

    if (isValidEmail) throw new BadRequestException(this.INVALID_EMAIL);

    try {
      const defaultUserRole = await this.em.findOne(Role, {
        name: UserRole.USER,
      });
      const user = this.em.create(User, {
        username,
        email,
        password,
        role: defaultUserRole,
      });
      await this.em.persistAndFlush(user);
      return { success: true };
    } catch (err) {
      console.error(err);
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async login({ email, password }: UserLoginDto): Promise<UserLoginResponse> {
    const user = await this.em.findOne(
      User,
      { email: email },
      {
        populate: ['role.name'],
        fields: ['password', 'role', 'profile', 'email', 'username'],
      },
    );

    if (!user || !(await this.hashService.compare(password, user.password)))
      throw new BadRequestException(this.INVALID_CRENDENTIAL);

    // generate new token for Authorization

    try {
      const { accessToken, refreshToken } =
        await this.userToken.signTokens(user);
      return { accessToken, refreshToken };
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException();
    }
  }

  async token({ refreshToken: token }: RefreshTokenDto) {
    try {
      let { id, tokenId } = await this.refreshTokenService.verify(token);
      const isValidate = await this.userToken.validate(id, tokenId, token);

      if (!isValidate)
        throw new UnauthorizedException(this.INVALID_REFRESH_TOKEN);

      await this.userToken.invalidate(id, tokenId);

      const user = await this.em.findOne(User, { id: id });

      if (!user) throw new BadRequestException(this.USER_NOT_FOUND);

      const { accessToken, refreshToken } =
        await this.userToken.signTokens(user);
      return { accessToken, refreshToken };
    } catch (err) {
      if (err instanceof JsonWebTokenError)
        throw new UnauthorizedException(this.INVALID_REFRESH_TOKEN);

      if (err instanceof HttpException) throw err;

      this.logger.error(err.message);
      throw new InternalServerErrorException();
    }
  }

  async logout(
    tokenId: string,
    userId: number,
    token: string,
  ): Promise<LogoutResponse> {
    try {
      await this.userToken.invalidate(userId, tokenId);
      await this.blackList.setToBlackList(token);
      return {
        message: 'user logout successfully',
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
