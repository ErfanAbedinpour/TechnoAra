import { Controller, Get, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';

@Role(UserRole.ADMIN)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':id')
  @Role(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
