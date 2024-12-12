
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
    constructor(private types: string[]) { }
    transform(value: IFile, metadata: ArgumentMetadata) {
        const reuslt = this.types.includes(value.mimetype)
        if (!reuslt)
            throw new BadRequestException(`file type expected is in (${this.types})`)

        return value;
    }
}
