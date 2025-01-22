export abstract class Storage {
    abstract upload(): Promise<string>

    abstract get(key: string): Promise<string>

    abstract remove(key: string): Promise<string>
}