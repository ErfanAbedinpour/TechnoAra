import { RemoveProductImageJob, UploadProductImageJob } from "../interface/job.interface";

export function ImageJobCreator<T extends UploadProductImageJob | RemoveProductImageJob>(data: T) {
    return data;
}

