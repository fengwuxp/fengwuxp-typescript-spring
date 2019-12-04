import { FeignClientExecutor } from "./FeignClientExecutor";
import { FeignProxyClient } from "./support/FeignProxyClient";
import { RequestURLResolver } from "./resolve/url/RequestURLResolver";
import { RequestHeaderResolver } from "./resolve/header/RequestHeaderResolver";
import { ApiSignatureStrategy } from "./signature/ApiSignatureStrategy";
import { FeignRequestOptions } from "./FeignRequestOptions";
import { RestOperations } from "./template/RestOperations";
import { FeignClientExecutorInterceptor } from "./FeignClientExecutorInterceptor";
/**
 * default feign client executor
 */
export default class DefaultFeignClientExecutor<T extends FeignProxyClient = FeignProxyClient> implements FeignClientExecutor<T> {
    protected apiService: T;
    protected requestURLResolver: RequestURLResolver;
    protected requestHeaderResolver: RequestHeaderResolver;
    protected apiSignatureStrategy: ApiSignatureStrategy;
    protected restTemplate: RestOperations;
    protected feignClientExecutorInterceptors: FeignClientExecutorInterceptor[];
    protected defaultRequestOptions: FeignRequestOptions;
    constructor(apiService: T);
    invoke: (methodName: string, ...args: any[]) => Promise<any>;
    private preHandle;
    private postHandle;
}
