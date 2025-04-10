import { DeleteObjectCommand, DeleteObjectCommandOutput, GetObjectCommand, HeadObjectCommand, PutObjectAclCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable, Logger } from "@nestjs/common";
import storageConfig from "../config/storage.config";
import { ConfigType } from "@nestjs/config";
import { FilePayload, Storage } from "./storage.abstract";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileNotFound } from "../exception/notFound.exception";
import { UnknownException } from "../exception/unknows.exception";



@Injectable()
export class S3Storage implements Storage {

    private client: S3Client
    private bucketName: string;
    private readonly logger = new Logger(S3Storage.name)

    constructor(@Inject(storageConfig.KEY) private config: ConfigType<typeof storageConfig>) {
        // config S3 Client

        this.client = new S3Client(
            {
                endpoint: 'https://' + config.endpoint,
                region: "ir",
                forcePathStyle: true,
                credentials: {
                    accessKeyId: config.accessKey,
                    secretAccessKey: config.secretKey
                }
            })
        this.bucketName = config.bucketName;
    }


    // upload object into cloud storage
    async upload({ body, key }: FilePayload): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: Buffer.isBuffer(body) ? body : Buffer.from(body),
        })

        try {
            await this.client.send(command)
            return this.keyToUrl(key);
        } catch (err) {
            this.logger.error(err)
            throw new UnknownException(`error during upload file`);
        }
    }


    private async isExist(key: string): Promise<boolean> {
        try {

            // check object is exist or not
            await this.client.send(new HeadObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }));
            return true;

        } catch (e) {
            return false
        }
    }

    // get object 
    async get(key: string): Promise<string> {

        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        })

        try {
            const isFileExist = await this.isExist(key);

            if (!isFileExist)
                throw new FileNotFound(`${key} not found`);

            const url = await getSignedUrl(this.client, command)
            return url;
        } catch (e) {
            if (e instanceof FileNotFound)
                throw e
            throw new UnknownException(e)
        }
    }

    // remove object
    async remove(key: string): Promise<boolean> {
        try {

            const orgKey = this.urlToKey(key);

            const isFilExist = await this.isExist(orgKey);


            if (!isFilExist)
                throw new FileNotFound(`${orgKey} not found`);

            const deleteParam = {
                Bucket: this.bucketName,
                Key: orgKey,
            };

            await this.client.send(new DeleteObjectCommand(deleteParam))

            return true;
        } catch (e) {
            if (e instanceof FileNotFound)
                throw e
            throw new UnknownException(e)
        }
    }

    private keyToUrl(key: string) {
        return `${this.config.endpoint}/${this.bucketName}/${key}`
    }

    private urlToKey(url: string) {
        /* 
        c360023.parspack.net/c360023/product/882049321927273000.jpg => product/882049321927273000.jpg
        */
        return url.split('/').splice(2).join("/");
    }
}
