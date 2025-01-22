import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileMimeValidationPipe implements PipeTransform {
    constructor(private imageKey: string[], private valieMimes: string[]) { }

    transform(value: any, metadata: ArgumentMetadata) {
        // "value" is an object containing the file's attributes and metadata
        for (const key of this.imageKey) {
            const files = value[key]

            if (!files || !files.length)
                continue;

            const res = files.every(file => {
                return this.valieMimes.includes(file.mimetype)
            })

            if (!res)
                throw new BadRequestException(`file mimes must be in ${this.valieMimes}`)
        }

        return value;
    }
}