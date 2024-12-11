import { Controller, Get, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { Pagination } from '../../types/paggination.type';

@Role(UserRole.ADMIN)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get()
  findAll(@Query() query: Pagination) {
    return this.userService.findAll({ limit: query.limit, page: query.page });
  }
  @Get(':id')
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
