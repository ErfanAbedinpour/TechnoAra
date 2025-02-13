import { Injectable } from "@nestjs/common";
import { StorageService } from "../../storage/storage.service";
import { AwsFolderName } from "../../storage/enums/folder-name.enum";
import { extname } from "path";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { QUEUES } from "../../../enums/queues.enum";
import { Job } from "bullmq";
import { ProductJobName, RemoveProductImageJob, UploadProductImageJob } from "../job/product-file.job";
import { EntityManager } from "@mikro-orm/postgresql";
import { ProductImage } from "../../../models/product-image";




@Injectable()
@Processor(QUEUES.PRODUCT_FILE)
export class ProductImageProcessor extends WorkerHost {
    private dirName = AwsFolderName.PRODUCT;

    constructor(private readonly storage: StorageService, private readonly entityManager: EntityManager) {

        super();
    }

    async process(job: Job<UploadProductImageJob | RemoveProductImageJob>) {
        const jobNames = (job.name) as ProductJobName;
        const em = this.entityManager.fork();

        switch (jobNames) {

            case ProductJobName.remove: {
                console.log('i am in remove ')
                const data = job.data as RemoveProductImageJob;
                // remove product image in cloud storage
                const removedKey = await this.storage.remove(data.key);

                console.log("Remove result is ", removedKey);
                //also remove from database
                const productRemoveImage = em.findOne(ProductImage, { product: data.productId, src: removedKey });
                console.log("this should be remove", productRemoveImage)

                if (!productRemoveImage)
                    em.removeAndFlush(productRemoveImage)

                break;
            }

            case ProductJobName.upload: {
                const data = job.data as UploadProductImageJob;
                // store in cloud
                const { url, isTitle } = await this.saveProductImage(data.file, data.isTitle)

                // also store in db
                try {
                    const obj = em.create(ProductImage, { isTitle: isTitle ?? false, product: data.productId, src: url });
                    await em.persistAndFlush(obj);
                } catch (err) {
                    throw err;
                }
                break;
            }
        }

    }

    private async saveProductImage(file: Express.Multer.File, isTitle?: boolean): Promise<{ url: string, isTitle?: boolean }> {

        const path = `${this.dirName}/${Math.ceil((Date.now() * Math.random()) * 1e6)}${extname(file.originalname)}`;

        try {
            const url = await this.storage.upload({
                key: path,
                body: file.buffer
            })

            return {
                url,
                isTitle
            }

        } catch (e) {
            throw e
        }
    }

    @OnWorkerEvent("completed")
    onComplete() {
        console.log("done!!");
    }


    @OnWorkerEvent("error")
    onError(err) {
        console.error(err)
    }
}