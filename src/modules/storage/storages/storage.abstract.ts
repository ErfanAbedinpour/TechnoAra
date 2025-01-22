// upload file input payload
export interface FilePayload {
    fileName: string;
    filePath: ReadableStream
}


export abstract class Storage {
    abstract upload(payload: FilePayload): Promise<string>

    abstract get(key: string): Promise<string>

    abstract remove(key: string): Promise<boolean>
}