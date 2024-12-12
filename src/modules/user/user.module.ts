import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../models/user.model';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User] }),],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
