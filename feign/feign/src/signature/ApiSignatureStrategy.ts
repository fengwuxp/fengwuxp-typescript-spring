
import {FeignOptions} from "../annotations/Feign";
import {UriVariable} from "../template/RestOperations";

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
     * 签名
     * @param fields        需要参与签名的字段
     * @param data          请求数据
     * @param feignOptions  请求数据
     */
    sign: (fields: string[], data: UriVariable, feignOptions: FeignOptions) => void;


}
