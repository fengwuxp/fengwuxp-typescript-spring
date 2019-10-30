import DefaultFeignClientExecutor from "../../../../packages/feign/src/DefaultFeignClientExecutor";
import {FeignProxyClient} from "../../../../packages/feign/src/support/FeignProxyClient";
import BrowserHttpAdapter from "../../../../packages/feign/src/adapter/browser/BrowserHttpAdapter";
import DefaultHttpClient from "../../../../packages/feign/src/client/DefaultHttpClient";
import RestTemplate from "../../../../packages/feign/src/template/RestTemplate";
import {AbstractFeignConfiguration} from "./AbstractFeignConfiguration";


export abstract class AbstractBrowserFeignConfiguration extends AbstractFeignConfiguration {


    private timeout: number;


    constructor(timeout: number = 5 * 1000) {
        super();
        this.timeout = timeout;
    }

    getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client: T) => {
        return new DefaultFeignClientExecutor<T>(client);
    };

    getHttpAdapter = () => new BrowserHttpAdapter(this.timeout);

    getHttpClient = () => new DefaultHttpClient(this.getHttpAdapter());

    getRestTemplate = () => new RestTemplate(this.getHttpClient());


}
