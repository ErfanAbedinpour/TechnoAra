import { Injectable } from "@nestjs/common";
import { StorageService } from "../../storage/storage.service";
import { AwsFolderName } from "../../storage/enums/folder-name.enum";
import { extname } from "path";

@Injectable()
export class ProductStorage {
    private dirName = AwsFolderName.PRODUCT;

    constructor(private readonly storage: StorageService) { }

    async saveProductImage(file: Express.Multer.File, isMain?: boolean): Promise<{ src: string, isMain?: boolean }> {

        const path = `${this.dirName}/${Math.ceil((Date.now() * Math.random()) * 1e6)}${extname(file.originalname)}`;

        try {
            const url = await this.storage.upload({
                key: path,
                path: file.buffer
            })

            return {
                src: url,
                isMain
            }

        } catch (e) {
            throw e
        }
    }
}