import {UriVariable} from "../template/RestOperations";
import {FeignRequestBaseOptions} from "../FeignRequestOptions";

/**
 * api signature strategy
 */
export interface ApiSignatureStrategy {

    /**
     * @param args
     */
    sign: (...args) => void
}


export interface SimpleApiSignatureStrategy extends ApiSignatureStrategy {


    /**
     * sign
     * @param fields        need sign filed
     * @param data          request body data or url param
     * @param feignOptions  feign request options
     */
    sign: (fields: string[], data: UriVariable, feignRequestBaseOptions: FeignRequestBaseOptions) => void;


}
