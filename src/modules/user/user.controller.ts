import { Controller, Get, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { Pagination } from '../../types/paggination.type';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetAllUserResponse, GetOneUserResponse } from './dto/get-user-response';

@Role(UserRole.ADMIN)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOkResponse({ description: "fetch users succesfully", type: GetAllUserResponse })
  @Get()
  findAll(@Query() query: Pagination): Promise<GetAllUserResponse> {
    return this.userService.findAll({ limit: query.limit, page: query.page });
  }

  @ApiOkResponse({ description: "get user succesfully", type: GetOneUserResponse })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GetOneUserResponse> {
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
