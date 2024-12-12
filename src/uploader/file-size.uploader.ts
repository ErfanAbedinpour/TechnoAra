
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    bytes: number;
    constructor(private size: number) {
        this.bytes = this.size * 1024 * 1024
    }
    transform(value: IFile, metadata: ArgumentMetadata) {
        if (!value)
            return null;
        const reuslt = value.size <= this.bytes;
        if (!reuslt)
            throw new BadRequestException(`excpected file size less than ${this.size} MB`)
        return value;
    }
}
