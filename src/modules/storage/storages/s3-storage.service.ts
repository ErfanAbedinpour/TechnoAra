import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import storageConfig from "../config/storage.config";
import { ConfigType } from "@nestjs/config";
import { Storage } from "./storage.abstract";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


@Injectable()
export class S3Storage implements Storage {
    private client: S3Client
    private bucketName: string;

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
        this.bucketName = config.bucketName;
    }

    async upload(): Promise<string> {
        return ""
    }

    async get(key: string): Promise<string> {

        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        })

        try {
            const file = await getSignedUrl(this.client, command)
            console.log(file);
            return file;
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    async remove(key: string): Promise<string> {
        return ""
    }
}
