import {FeignClientExecutorInterceptor} from "./FeignClientExecutor";
import {FeignRequestBaseOptions} from "./FeignRequestOptions";


export default class FeignClientExecutorInterceptorExecutor<T extends FeignRequestBaseOptions = FeignRequestBaseOptions>
    implements FeignClientExecutorInterceptor<T> {

    protected interceptors: FeignClientExecutorInterceptor<T>[];


    constructor(interceptors: FeignClientExecutorInterceptor<T>[]) {
        this.interceptors = interceptors || [];
    }

    postHandle = async <E = any>(options: T, response: E): Promise<any> => {
        const {interceptors} = this;
        let result: any = response, len = interceptors.length, index = 0;
        while (index < len) {
            const feignClientExecutorInterceptor = interceptors[index];
            result = await feignClientExecutorInterceptor.postHandle(options, result);
            index++;
        }

        return result;
    };

    preHandle = async (options: T) => {

        const {interceptors} = this;
        let result: T = options, len = interceptors.length, index = 0;
        while (index < len) {
            const feignClientExecutorInterceptor = interceptors[index];
            result = await feignClientExecutorInterceptor.preHandle(result);
            index++;
        }

        return result;
    };

    /**
     * Set the request interceptors that this http client should use.
     * @param interceptors
     */
    public setInterceptors = (interceptors: FeignClientExecutorInterceptor<T>[]) => {
        this.interceptors = interceptors;
    };

    /**
     * Get the request interceptors
     */
    public getInterceptors = () => this.interceptors;


}
