export interface TypeFilter<T = any> {


    match: (file: T) => boolean;
}
