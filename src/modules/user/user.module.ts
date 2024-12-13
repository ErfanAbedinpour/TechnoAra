import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../models/user.model';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User] }), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
