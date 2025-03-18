import { Injectable } from "@nestjs/common";
import { StorageService } from "../../storage/storage.service";
import { DirectoryName } from "../../storage/enums/directory-name.enum";
import { extname } from "path";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { QUEUES } from "../../../enums/queues.enum";
import { Job } from "bullmq";
import { EntityManager } from "@mikro-orm/postgresql";
import { ProductImage } from "../../../models/product-image";
import { ProductJobName, RemoveProductImageJob, UploadProductImageJob } from "../interface/job.interface";




@Injectable()
@Processor(QUEUES.PRODUCT_FILE)
export class ProductImageProcessor extends WorkerHost {
    private dirName = DirectoryName.PRODUCT;

    constructor(private readonly storage: StorageService, private readonly entityManager: EntityManager) {

        super();
    }

    async process(job: Job<UploadProductImageJob | RemoveProductImageJob>) {
        const jobNames = (job.name) as ProductJobName;
        const em = this.entityManager.fork();

        switch (jobNames) {

            case ProductJobName.remove: {
                const data = job.data as RemoveProductImageJob;
                const key = data.key
                // remove product image in cloud storage
                await this.storage.remove(key);

                //also remove from database
                const productRemoveImage = em.findOne(ProductImage, { product: data.productId, src: key });

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