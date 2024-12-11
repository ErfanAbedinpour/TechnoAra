import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { User } from '../../../models/user.model';

export class UpdateUserDto extends PartialType(User) { }
