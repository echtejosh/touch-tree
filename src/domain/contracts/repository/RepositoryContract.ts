export interface RepositoryMethods<T> {
    getAll(id?: number): Promise<T[] | null>;

    getById(id: number): Promise<T | null>;

    create(values: T): Promise<boolean>;

    update(values: T): Promise<boolean>;

    remove(id: number): Promise<boolean>;
}

export type RepositoryContract<
    T,
    Overrides extends Partial<Record<keyof RepositoryMethods<T>, unknown>> = NonNullable<unknown>,
> = {
    [K in keyof RepositoryMethods<T>]: K extends keyof Overrides
        ? Overrides[K]
        : RepositoryMethods<T>[K];
};
