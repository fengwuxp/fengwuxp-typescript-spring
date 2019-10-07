import {HttpRequestDataEncoder} from "./HttpRequestDataEncoder";
import {FeignRequestOptions} from "../FeignRequestOptions";
import {QueryParamType} from "../template/RestOperations";

export type DateFormatter = (date: Date) => number | string

const defaultDateFormatter: DateFormatter = (date: Date) => date.getTime();


/**
 * encode/format the Date type in the request data or query params
 * Default conversion to timestamp
 */
export default class DateEncoder<T extends FeignRequestOptions = FeignRequestOptions> implements HttpRequestDataEncoder<T> {

    private dateFormatter: DateFormatter;

    constructor(dateFormatter?: DateFormatter) {
        this.dateFormatter = dateFormatter || defaultDateFormatter;
    }

    encode = async (request: T): Promise<T> => {
        const {body, queryParams} = request;
        request.queryParams = this.formatterDate(queryParams);
        // if (isBrowserFormData(body)) {
        //     return request;
        // }
        request.body = this.formatterDate(body);
        return request;
    };

    formatterDate = (data: QueryParamType) => {
        if (data == null) {
            return;
        }
        const {dateFormatter} = this;

        for (const key in data) {
            const val = data[key];
            if (val != null && val.constructor === Date) {
                //如果是时间字段转换为时间戳
                data[key] = dateFormatter(val as Date);
            }
        }
        return data;
    }

}
