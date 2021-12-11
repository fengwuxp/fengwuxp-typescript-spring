import {HttpRequestDataEncoder} from "./HttpRequestDataEncoder";
import {FeignRequestOptions} from "../FeignRequestOptions";
import {DateConverter, timeStampDateConverter} from './converter/DateConverter';
import {QueryParamType} from "../template/RestOperations";


/**
 * encode/format the Date type in the request data or query params
 * Default conversion to timestamp
 */
export default class DateEncoder<T extends FeignRequestOptions = FeignRequestOptions> implements HttpRequestDataEncoder<T> {

    private dateConverter: DateConverter;

    constructor(dateConverter?: DateConverter) {
        this.dateConverter = dateConverter || timeStampDateConverter;
    }

    encode = async (request: T) => {
        request.queryParams = this.converterDate(request.queryParams);
        request.body = this.converterDate(request.body as any);
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
