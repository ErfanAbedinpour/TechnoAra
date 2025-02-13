import { DeleteObjectCommand, DeleteObjectCommandOutput, GetObjectCommand, HeadObjectCommand, PutObjectAclCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
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


    // uplaod object into cloud storage
    async upload({ body, key }: FilePayload): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: Buffer.isBuffer(body) ? body : Buffer.from(body),
        })

        try {
            const response = await this.client.send(command)
            return `${this.config.endpoint}/${this.bucketName}/${key}`
        } catch (err) {
            console.error(err);
            throw new UnknownException(`error during upload file`);
        }
    }


    private async isFileExsist(key: string): Promise<boolean> {
        try {

            // check object is exsist or not
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
            const isFileExsist = await this.isFileExsist(key);
            if (!isFileExsist)
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
    async remove(key: string): Promise<string> {
        try {
            const isFileExsist = await this.isFileExsist(key);

            if (!isFileExsist)
                throw new FileNotFound(`${key} not found`);

            const deleteParam = {
                Bucket: this.bucketName,
                Key: key,
            };

            await this.client.send(new DeleteObjectCommand(deleteParam))

            return `${this.config.endpoint}/${this.bucketName}/${key}`
        } catch (e) {
            if (e instanceof FileNotFound)
                throw e
            throw new UnknownException(e)
        }
    }
}
