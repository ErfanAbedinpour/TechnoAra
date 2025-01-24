import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileMimeValidationPipe<T> implements PipeTransform {
    constructor(private imageKey: string[], private valieMimes: string[]) { }

    transform(value: T, metadata: ArgumentMetadata) {

        for (const key of this.imageKey) {
            const files = value && value[key]

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