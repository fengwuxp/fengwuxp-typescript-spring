import {FeignConfiguration} from "./FeignConfiguration";
import {FeignProxyClient} from "../support/FeignProxyClient";
import DefaultFeignClientExecutor from "../DefaultFeignClientExecutor";
import DefaultHttpClient from "../client/DefaultHttpClient";
import RestTemplate from "../template/RestTemplate";
import {HttpRequest} from "../client/HttpRequest";
import {HttpAdapter} from "../adapter/HttpAdapter";


export abstract class AbstractFeignConfiguration implements FeignConfiguration {

    getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client: T) => {
        return new DefaultFeignClientExecutor<T>(client);
    };

    abstract getHttpAdapter: <T extends HttpRequest = HttpRequest>() => HttpAdapter;

    getHttpClient = () => new DefaultHttpClient(this.getHttpAdapter());

    getRestTemplate = () => new RestTemplate(this.getHttpClient());
}
