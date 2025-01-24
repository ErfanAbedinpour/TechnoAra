import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileKeysValidationPipe implements PipeTransform {
    constructor(private readonly requiredKeys: string[]) { }

    transform(value: any) {
        if (!value || Object.keys(value).length === 0) {
            throw new BadRequestException('No files uploaded. At least one file is required.');
        }

        const existingKeys = Object.keys(value);
        const hasRequiredKey = this.requiredKeys.some((key) => existingKeys.includes(key));

        if (!hasRequiredKey) {
            throw new BadRequestException(`At least one of the following keys is required: ${this.requiredKeys.join(', ')}`);
        }

        return value;
    }
}
