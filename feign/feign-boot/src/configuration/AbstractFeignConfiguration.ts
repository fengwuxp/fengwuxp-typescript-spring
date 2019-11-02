import {FeignConfiguration} from "../../../../packages/feign/src/configuration/FeignConfiguration";
import {FeignProxyClient} from "../../../../packages/feign/src/support/FeignProxyClient";
import DefaultFeignClientExecutor from "../../../../packages/feign/src/DefaultFeignClientExecutor";
import DefaultHttpClient from "../../../../packages/feign/src/client/DefaultHttpClient";
import RestTemplate from "../../../../packages/feign/src/template/RestTemplate";
import {HttpRequest} from "../../../../packages/feign/src/client/HttpRequest";
import {HttpAdapter} from "../../../../packages/feign/src/adapter/HttpAdapter";


export abstract class AbstractFeignConfiguration implements FeignConfiguration {

    getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client: T) => {
        return new DefaultFeignClientExecutor<T>(client);
    };

    abstract getHttpAdapter: <T extends HttpRequest = HttpRequest>() => HttpAdapter;

    getHttpClient = () => new DefaultHttpClient(this.getHttpAdapter());

    getRestTemplate = () => new RestTemplate(this.getHttpClient());
}
