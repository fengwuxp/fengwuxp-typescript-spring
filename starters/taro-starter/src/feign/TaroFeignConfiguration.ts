import {
    AbstractFeignConfiguration,
    DefaultHttpClient,
    HttpAdapter,
    HttpRequest,
    RoutingClientHttpRequestInterceptor,
    ClientHttpRequestInterceptor,
    NetworkClientHttpRequestInterceptor
} from "fengwuxp-typescript-feign";
import TaroHttpAdapter from "./TaroHttpAdapter";
import {TaroHttpRequest} from "./TaroHttpRequest";
import TaroNetworkStatusListener from "./TaroNetworkStatusListener";



export abstract class TaroFeignConfiguration extends AbstractFeignConfiguration {

    private timeout: number;

    private interceptors: ClientHttpRequestInterceptor[];


    constructor(timeout: number = 5 * 1000) {
        super();
        this.timeout = timeout;
    }

    getHttpAdapter = (): HttpAdapter => new TaroHttpAdapter(this.timeout);


    getHttpClient = <T extends HttpRequest = HttpRequest>() => {
        const httpClient = new DefaultHttpClient(this.getHttpAdapter());
        httpClient.setInterceptors(this.interceptors);
        return httpClient;
    };
}
