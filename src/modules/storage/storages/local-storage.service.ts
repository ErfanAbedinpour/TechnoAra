import { DirectoryName } from "../enums/directory-name.enum";
import { FilePayload, Storage } from "./storage.abstract";
import { stat, rm, writeFile } from 'fs/promises'
import { Logger } from "@nestjs/common";
import { UnknownException } from "../exception/unknows.exception";
import { FileNotFound } from "../exception/notFound.exception";


export class LocalFileStorage implements Storage {

    private logger = new Logger(LocalFileStorage.name);

    private fullPath: string;
    constructor(private readonly subDirectory: DirectoryName) {
        this.fullPath = `${process.cwd()}/public/${this.subDirectory}`
    }

    async upload({ body, key }: FilePayload): Promise<string> {
        const uploadPath = `${this.fullPath}/${key}`
        await writeFile(uploadPath, body)
        return `/public/${this.subDirectory}/${key}`;
    }

    async remove(key: string): Promise<boolean> {
        const path = `${process.cwd()}/${key}`
        try {
            await rm(path)
            return true;
        } catch (err) {
            this.logger.error(err)
            throw new UnknownException(err.message)
        }
    }

    async get(key: string): Promise<string> {
        const path = `${process.cwd()}/${key}`
        try {
            if (await stat(path))
                return path

        } catch (err) {
            this.logger.error(err)
            if (err.code == 'ENOENT') {
                throw new FileNotFound("file does not found")
            }
            throw new UnknownException(err.message)
        }
    }

} 