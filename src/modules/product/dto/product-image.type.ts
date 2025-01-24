import { IsNotEmpty, IsObject, IsString } from "class-validator"

export interface IPrdouctImage {
    main: Express.Multer.File[]
    product_gallery: Express.Multer.File[]
}