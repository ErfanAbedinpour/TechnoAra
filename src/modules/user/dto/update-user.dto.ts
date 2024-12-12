import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { UserRole } from '../../../models/role.model';
import { RegisterUserDto } from '../../auth/dtos/user.register';
import { IsEnum, IsOptional, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { AtOneLeastRequired } from '../../decorator/oneItemMustBeRequired';
import { User } from '../../../models/user.model';
import { IFile } from '@nestjs/common/pipes/file/interfaces';




export class UpdateUserDto extends PartialType(RegisterUserDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    profile?: Express.Multer.File;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bio?: string;
    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    phone?: string;
    @IsOptional()
    @IsEnum(UserRole)
    @ApiPropertyOptional()
    role?: UserRole;
    @Validate(AtOneLeastRequired<UpdateUserDto>)
    oneLeaseRequired: string;
}


export class UpdateUserRespone {
    @ApiProperty({ type: () => User })
    user: User
}