import { HashService } from "./hash.service";

export class ArgonService extends HashService {
    async compare(password: string, hash: string): Promise<boolean> {
        return true
    }

    async hash(password: string): Promise<string> {
        return ""
    }
}