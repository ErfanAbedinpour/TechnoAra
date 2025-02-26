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
import { LogoutDto, RefreshTokenDto } from './dtos/refresh.token.dto';
import {
  RefreshTokenPayload,
  RefreshTokenService,
} from './tokens/refreshToken.service';
import { Role } from './decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { JsonWebTokenError } from '@nestjs/jwt';
import { BlackListService } from './blacklist/blacklist.service';
import { LogoutResponse } from './dtos/user-logout-response';
import { ErrorMessages } from '../../errorResponse/err.response';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUES } from '../../enums/queues.enum';
import { Queue } from 'bullmq';
import { sendMailJob } from '../email/jobs/send-mail.job';
import { MailSubject } from '../email/enums/mail.subject.enum';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly em: EntityManager,
    private readonly hashService: HashService,
    private readonly userToken: UserTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly blackList: BlackListService,
    @InjectQueue(QUEUES.WELCOME_EMAIL) readonly welcomeQueue: Queue,
  ) { }

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

    if (isValidEmail)
      throw new BadRequestException(ErrorMessages.INVALID_EMAIL);

    try {
      const defaultUserRole = await this.em.findOne(Role, {
        name: UserRole.USER,
      });

      const user = this.em.create(
        User,
        {
          username,
          email,
          password,
          role: defaultUserRole,
        },
        { persist: true },
      );

      await this.em.flush();
      const msg = `<h1> Welcome To TechnoAra </h1>
      <h2> ${user.username} thanks for register in TechnoAra </h2>`;
      // send Data To Queue
      await this.welcomeQueue.add(
        'welcome-email',
        sendMailJob({
          to: user.email,
          subject: MailSubject.WELCOME,
          html: msg,
        }),
      );
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
      throw new BadRequestException(ErrorMessages.INVALID_CRENDENTIAL);

    // generate new token for Authorization

    try {
      const { accessToken, refreshToken } =
        await this.userToken.signTokens(user);

      return { accessToken, refreshToken } as UserLoginResponse;
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
        throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);

      await this.userToken.invalidate(id, tokenId);

      const user = await this.em.findOne(User, { id: id });

      if (!user) throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);

      const { accessToken, refreshToken } =
        await this.userToken.signTokens(user);
      return { accessToken, refreshToken };
    } catch (err) {
      if (err instanceof JsonWebTokenError)
        throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);

      if (err instanceof HttpException) throw err;

      this.logger.error(err.message);
      throw new InternalServerErrorException();
    }
  }

  async logout({
    accessToken,
    refreshToken,
  }: LogoutDto): Promise<LogoutResponse> {
    try {
      const { id, tokenId } =
        await this.refreshTokenService.verify(refreshToken);
      // invalidate refreshToken
      await this.userToken.invalidate(id, tokenId);
      // set accessToken to Blacklist
      await this.blackList.setToBlackList(accessToken);
      return {
        message: 'user logout successfully',
      };
    } catch (err) {
      console.log(err);
      this.logger.warn(err);
      throw new UnauthorizedException(err.message);
    }
  }
}
