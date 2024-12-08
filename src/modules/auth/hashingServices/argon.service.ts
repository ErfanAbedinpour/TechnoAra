import { HashService } from "./hash.service";
import { randomBytes } from 'crypto'
import { hash, verify } from "argon2";

export class ArgonService extends HashService {
    private SALT_LEN = 12

    async compare(password: string, hash: string): Promise<boolean> {
        return verify(hash, password)
    }

    async hash(password: string): Promise<string> {
        const salt = randomBytes(this.SALT_LEN).toString('hex')
        const buf = Buffer.from(salt)
        return hash(password, { salt: buf })
    }
}