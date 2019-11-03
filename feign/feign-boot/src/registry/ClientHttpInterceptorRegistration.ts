import {InterceptorRegistration} from "./InterceptorRegistration";
import {ClientHttpRequestInterceptor, MappedClientHttpRequestInterceptor} from "fengwuxp-typescript-feign";


/**
 * client http interceptor registration
 */
export default class ClientHttpInterceptorRegistration extends InterceptorRegistration {

    constructor(clientInterceptor: ClientHttpRequestInterceptor) {
        super(clientInterceptor);
    }


    public getInterceptor = (): MappedClientHttpRequestInterceptor => {

        return new MappedClientHttpRequestInterceptor(
            this.interceptor,
            this.includePatterns,
            this.excludePatterns,
            this.includeMethods,
            this.excludeMethods,
            this.includeHeaders,
            this.excludeHeaders
        );
    };


}
