import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, UpdateUserRespone } from './dto/update-user.dto';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { Pagination } from '../../types/paggination.type';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  GetAllUserResponse,
  GetOneUserResponse,
} from './dto/get-user-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../../uploader/file-size.uploader';
import { FileTypeValidationPipe } from '../../uploader/file-type.uploader';
import { RemoveUserResponse } from './dto/remove-user.dto';

@ApiBearerAuth()
@Role(UserRole.ADMIN)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'fetch users succesfully',
    type: GetAllUserResponse,
  })
  @Get()
  findAll(@Query() query: Pagination): Promise<GetAllUserResponse> {
    return this.userService.findAll({ limit: query.limit, page: query.page });
  }

  @ApiOkResponse({
    description: 'get user succesfully',
    type: GetOneUserResponse,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GetOneUserResponse> {
    return this.userService.findOne(id);
  }

  @ApiOkResponse({
    description: 'user updated successfully',
    type: UpdateUserRespone,
  })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiConflictResponse({ description: 'email is taken by another user' })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('profile'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
    @UploadedFile(
      new FileSizeValidationPipe(2),
      new FileTypeValidationPipe(['image/png', 'image/jpeg']),
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ): Promise<UpdateUserRespone> {
    body.profile = file ?? null;
    return this.userService.update(id, body);
  }

  @ApiNotFoundResponse({ description: 'user not found.' })
  @ApiOkResponse({
    description: 'user removed successfully.',
    type: RemoveUserResponse,
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<RemoveUserResponse> {
    return this.userService.remove(id);
  }
}
