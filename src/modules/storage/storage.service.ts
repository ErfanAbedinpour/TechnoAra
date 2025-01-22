import { Injectable } from '@nestjs/common';
import { S3Storage } from './storages/s3-storage.service';
import { FilePayload } from './storages/storage.abstract';

@Injectable()
export class StorageService {
    constructor(private readonly s3Service: S3Storage) { }

    async get(key: string): Promise<string> {
        try {
            const result = await this.s3Service.get(key);
            return result
        } catch (e) {
            throw e;
        }
    }


    async remove(key: string): Promise<boolean> {
        try {
            const isRemoved = this.s3Service.remove(key);
            return isRemoved
        } catch (e) {
            throw e
        }
    }

    upload(payLoad: FilePayload): Promise<string> {
        try {
            return this.s3Service.upload(payLoad);
        } catch (e) {

            throw e;
        }
    }
}
