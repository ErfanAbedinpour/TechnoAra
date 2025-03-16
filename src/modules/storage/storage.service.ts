import { Injectable } from '@nestjs/common';
import { FilePayload, Storage } from './storages/storage.abstract';

@Injectable()
export class StorageService {
    constructor(private readonly service: Storage) { }

    async get(key: string): Promise<string> {
        try {
            const result = await this.service.get(key);
            return result
        } catch (e) {
            throw e;
        }
    }


    async remove(key: string): Promise<boolean> {
        try {
            return this.service.remove(key);
        } catch (e) {
            throw e
        }
    }

    upload(payLoad: FilePayload): Promise<string> {
        try {
            return this.service.upload(payLoad);
        } catch (e) {

            throw e;
        }
    }
}
