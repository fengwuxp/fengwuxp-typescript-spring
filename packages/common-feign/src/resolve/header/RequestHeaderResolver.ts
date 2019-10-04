import {UriVariable} from "../../template/RestOperations";
import {FeignProxyClient} from "../../support/FeignProxyClient";


/**
 * resolve request header
 */
export type RequestHeaderResolver = (apiService: FeignProxyClient, methodName: string, headers: Record<string, string>, data: UriVariable) => Record<string, string>

