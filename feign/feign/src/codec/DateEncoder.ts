import {HttpRequestDataEncoder} from "./HttpRequestDataEncoder";
import {FeignRequestOptions} from "../FeignRequestOptions";
import {QueryParamType} from "../template/RestOperations";

// date Converter
export type DateConverter = (date: Date) => number | string

const defaultDateConverter: DateConverter = (date: Date) => date.getTime();


/**
 * encode/format the Date type in the request data or query params
 * Default conversion to timestamp
 */
export default class DateEncoder<T extends FeignRequestOptions = FeignRequestOptions> implements HttpRequestDataEncoder<T> {

    private dateConverter: DateConverter;

    constructor(dateConverter?: DateConverter) {
        this.dateConverter = dateConverter || defaultDateConverter;
    }

    encode = async (request: T): Promise<T> => {
        const {body, queryParams} = request;
        request.queryParams = this.converterDate(queryParams);
        request.body = this.converterDate(body);
        return request;
    };

    private converterDate = (data: QueryParamType) => {
        if (data == null) {
            return;
        }
        const {dateConverter} = this;

        for (const key in data) {
            const val = data[key];
            if (val != null && val.constructor === Date) {
                // converter date type
                data[key] = dateConverter(val as Date);
            }
        }
        return data;
    }

}
