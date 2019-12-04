import { HttpRequestDataEncoder } from "./HttpRequestDataEncoder";
import { FeignRequestOptions } from "../FeignRequestOptions";
import { DateConverter } from './converter/DateConverter';
/**
 * encode/format the Date type in the request data or query params
 * Default conversion to timestamp
 */
export default class DateEncoder<T extends FeignRequestOptions = FeignRequestOptions> implements HttpRequestDataEncoder<T> {
    private dateConverter;
    constructor(dateConverter?: DateConverter);
    encode: (request: T) => Promise<T>;
    private converterDate;
}
