export interface OpenApiParser<T> {

    parse: () => Promise<T>
}