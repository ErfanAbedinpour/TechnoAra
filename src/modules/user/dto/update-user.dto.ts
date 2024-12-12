import { ApiProperty, ApiPropertyOptional, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { UserRole } from '../../../models/role.model';
import { RegisterUserDto } from '../../auth/dtos/user.register';
import { IsEnum, IsOptional, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { AtOneLeastRequired } from '../../../decorator/oneItemMustBeRequired';
import { User } from '../../../models/user.model';
import { UserDto } from './user.dto';




export class UpdateUserDto extends PartialType(RegisterUserDto) {
    @ApiPropertyOptional({ type: "string", format: "binary" })
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
    @ApiProperty({ type: PickType(UserDto, ["email", 'username', 'bio', 'id', 'phone', 'profile']) })

    user: User
}