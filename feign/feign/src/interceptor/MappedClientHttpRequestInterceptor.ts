import {HttpRequest} from "../client/HttpRequest";
import {
    ClientHttpRequestInterceptor,
    ClientHttpRequestInterceptorInterface
} from "../client/ClientHttpRequestInterceptor";
import {HttpMethod} from "../constant/http/HttpMethod";
import {converterFunctionInterface} from "../utils/ConverterFunctionInterface";
import {MappedInterceptor} from "./MappedInterceptor";


/**
 * match interceptor
 */
export default class MappedClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest>
    extends MappedInterceptor
    implements ClientHttpRequestInterceptorInterface<T> {


    private clientInterceptor: ClientHttpRequestInterceptor<T>;


    constructor(clientInterceptor: ClientHttpRequestInterceptor<T>,
                includePatterns?: string[],
                excludePatterns?: string[],
                includeMethods?: HttpMethod[],
                excludeMethods?: HttpMethod[],
                includeHeaders?: string[][],
                excludeHeaders?: string[][]) {
        super(includePatterns, excludePatterns, includeMethods, excludeMethods, includeHeaders, excludeHeaders);
        this.clientInterceptor = clientInterceptor;

    }


    public intercept = (req: T): Promise<T> => {
        const clientHttpRequestInterceptorInterface = converterFunctionInterface<ClientHttpRequestInterceptor<T>, ClientHttpRequestInterceptorInterface<T>>(this.clientInterceptor);
        return clientHttpRequestInterceptorInterface.intercept(req);
    };





}
