import { IsNotEmpty, IsObject, IsString } from "class-validator"

export interface IProductImage {
    main: Express.Multer.File[]
    product_gallery: Express.Multer.File[]
}