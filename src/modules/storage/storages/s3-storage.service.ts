import { S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import storageConfig from "../config/storage.config";
import { ConfigType } from "@nestjs/config";
import { Storage } from "./storage.abstract";



@Injectable()
export class S3Storage implements Storage {
    private client: S3Client
    private readonly bucketName = "c360023"

    constructor(@Inject(storageConfig.KEY) private config: ConfigType<typeof storageConfig>) {
        this.client = new S3Client(
            {
                endpoint: config.endpoint,
                region: "ir",
                forcePathStyle: true,
                credentials: {
                    accessKeyId: config.accessKey,
                    secretAccessKey: config.secretKey
                }
            })
    }

    async upload(): Promise<string> {
        return ""
    }

    async get(): Promise<string> {
        return ""
    }

    async remove(): Promise<string> {
        return ""
    }
}