import DefaultFeignClientExecutor from "../DefaultFeignClientExecutor";
import {FeignProxyClient} from "../support/FeignProxyClient";
import BrowserHttpAdapter from "../adapter/browser/BrowserHttpAdapter";
import DefaultHttpClient from "../client/DefaultHttpClient";
import RestTemplate from "../template/RestTemplate";
import {AbstractFeignConfiguration} from "./AbstractFeignConfiguration";


export abstract class AbstractBrowserFeignConfiguration extends AbstractFeignConfiguration {


    private timeout: number;


    constructor(timeout: number = 10 * 1000) {
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
