
export enum ProductJobName {
    remove = 'remove',
    upload = 'upload'
}

export interface UploadProductImageJob {
    file: Express.Multer.File,
    productId: number;
    isTitle?: boolean
}

export interface RemoveProductImageJob {
    key: string,
    productId: number
}

