import {ClientHttpRequestInterceptor} from "../client/ClientHttpRequestInterceptor";
import MappedClientHttpRequestInterceptor from './MappedClientHttpRequestInterceptor';
import {InterceptorRegistration} from "./InterceptorRegistration";


/**
 * client http interceptor registration
 */
export default class ClientHttpInterceptorRegistration extends InterceptorRegistration {


    private clientInterceptor: ClientHttpRequestInterceptor;


    constructor(clientInterceptor: ClientHttpRequestInterceptor) {
        super();
        this.clientInterceptor = clientInterceptor;
    }


    public getInterceptor = (): MappedClientHttpRequestInterceptor => {

        return new MappedClientHttpRequestInterceptor(
            this.clientInterceptor,
            this.includePatterns,
            this.excludePatterns,
            this.includeMethods,
            this.excludeMethods,
            this.includeHeaders,
            this.excludeHeaders
        );
    };


}
