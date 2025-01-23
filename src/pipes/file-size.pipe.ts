import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe<T> implements PipeTransform {
    constructor(private imageKey: string[]) { }

    transform(value: T, metadata: ArgumentMetadata) {
        const threeMb = 1024 * 1024 * 3

        for (const key of this.imageKey) {

            const files = value[key];

            if (!files || !files.length)
                continue;

            const res = files.every(file => {
                return file.size < threeMb
            })

            if (!res)
                throw new BadRequestException("file size must be lower than 3MB")
        }




        return value;

    }
}