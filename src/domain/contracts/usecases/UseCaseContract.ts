export interface UseCaseContract<T, U> {
    handle(values: T extends undefined ? void : T): U;
}
