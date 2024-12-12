import { createWriteStream, write } from "fs";
import { extname } from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

const BASE_PATH = `${process.cwd()}/public`

export enum PATH_TO_WRITE {
    profile = "profile"
}

export async function writeToFile(path: PATH_TO_WRITE, file: Express.Multer.File): Promise<{ filename: string }> {
    const uniqueName = `${Date.now() * Math.floor(Math.random() * 1e6)}${extname(file.originalname)}`
    const fullPath = `${BASE_PATH}/${path}/${uniqueName}`;
    const readStram = Readable.from(file.buffer);
    const writeStram = createWriteStream(fullPath);
    const ac = new AbortController();
    const signal = ac.signal;
    await pipeline(readStram, writeStram, { signal })

    writeStram.close(() => {
        readStram.destroy();
        writeStram.destroy();
    })

    writeStram.on('error', (err) => {
        throw new Error(err.message);
    })
    return { filename: uniqueName }
}
