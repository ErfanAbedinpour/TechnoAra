export abstract class Storage {
    abstract upload(): Promise<string>

    abstract get(): Promise<string>

    abstract remove(): Promise<string>
}