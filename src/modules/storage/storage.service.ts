import { Injectable } from '@nestjs/common';
import { S3Storage } from './storages/s3-storage.service';

@Injectable()
export class StorageService {
    constructor(private readonly s3Service: S3Storage) { }

    async get(key: string) {
        try {
            const result = await this.s3Service.get(key)
            return result
        } catch (e) {
            throw e;
        }
    }
}
