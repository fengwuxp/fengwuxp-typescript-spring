export interface OpenApiParser<T = any> {

    parse: () => Promise<T>
}