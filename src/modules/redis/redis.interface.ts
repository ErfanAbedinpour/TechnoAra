export interface IRedis {
    set: (key: string, value: string, ttl?: number) => Promise<string>
    get: (key: string) => Promise<string>
    del: (key: string) => Promise<boolean>
}