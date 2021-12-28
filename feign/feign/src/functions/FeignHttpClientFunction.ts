import {FeignRequestOptions} from "../FeignRequestOptions";


export type FeignHttpClientFunction<T, R> = (req: T | undefined, options?: FeignRequestOptions) => R;

export type FeignHttpClientPromiseFunction<T, R = any> = FeignHttpClientFunction<T, Promise<R>>;