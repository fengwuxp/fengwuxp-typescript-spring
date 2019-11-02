import {
    DefaultFeignClientExecutor, DefaultHttpClient,
    FeignConfiguration,
    FeignProxyClient,
    HttpAdapter,
    HttpRequest, RestTemplate
} from "fengwuxp-typescript-feign";




export abstract class AbstractFeignConfiguration implements FeignConfiguration {

    getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client: T) => {
        return new DefaultFeignClientExecutor<T>(client);
    };

    abstract getHttpAdapter: <T extends HttpRequest = HttpRequest>() => HttpAdapter;

    getHttpClient = () => new DefaultHttpClient(this.getHttpAdapter());

    getRestTemplate = () => new RestTemplate(this.getHttpClient());
}
