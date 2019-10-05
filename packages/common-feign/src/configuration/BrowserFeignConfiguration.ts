import {FeignConfiguration} from "./FeignConfiguration";
import DefaultFeignClientExecutor from "../DefaultFeignClientExecutor";
import {FeignProxyClient} from "../support/FeignProxyClient";
import BrowserHttpAdapter from "../adapter/browser/BrowserHttpAdapter";
import DefaultHttpClient from "../client/DefaultHttpClient";
import RestTemplate from "../template/RestTemplate";


export class BrowserFeignConfiguration implements FeignConfiguration {

    getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client: T) => {
        return new DefaultFeignClientExecutor<T>(client);
    };

    getHttpAdapter = () => new BrowserHttpAdapter(10 * 1000);

    getHttpClient = () => new DefaultHttpClient(this.getHttpAdapter());

    getRestTemplate = () => new RestTemplate(this.getHttpClient());


}
