import {FeignConfiguration} from "./FeignConfiguration";
import DefaultFeignClientExecutor from "../DefaultFeignClientExecutor";
import {FeignProxyClient} from "../support/FeignProxyClient";
import BrowserHttpAdapter from "../adapter/browser/BrowserHttpAdapter";
import DefaultHttpClient from "../client/DefaultHttpClient";
import RestTemplate from "../template/RestTemplate";
import MockHttpAdapter from "../adapter/mock/MockHttpAdapter";


export class MockFeignConfiguration implements FeignConfiguration {

    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client: T) => {
        return new DefaultFeignClientExecutor<T>(client);
    };

    getHttpAdapter = () => new MockHttpAdapter(this.baseUrl);

    getHttpClient = () => new DefaultHttpClient(this.getHttpAdapter());

    getRestTemplate = () => new RestTemplate(this.getHttpClient());


}
