import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    constructor(private imageKey: string[]) { }

    transform(value: any, metadata: ArgumentMetadata) {
        // "value" is an object containing the file's attributes and metadata
        const threeMb = 1024 * 1024 * 3

        for (const key of this.imageKey) {
            const curentImg = value[key];
            if (curentImg) {
                // validate files size
                const res = curentImg.every(file => {
                    return file.size < threeMb
                })

                // if result not true throw Error
                if (!res)
                    throw new BadRequestException("file size must be lower than 3MB")

            }
        }

        return true

    }
}