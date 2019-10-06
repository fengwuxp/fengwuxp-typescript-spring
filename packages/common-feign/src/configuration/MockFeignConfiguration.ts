import {FeignConfiguration} from "./FeignConfiguration";
import DefaultFeignClientExecutor from "../DefaultFeignClientExecutor";
import {FeignProxyClient} from "../support/FeignProxyClient";
import BrowserHttpAdapter from "../adapter/browser/BrowserHttpAdapter";
import DefaultHttpClient from "../client/DefaultHttpClient";
import RestTemplate from "../template/RestTemplate";
import MockHttpAdapter from "../adapter/mock/MockHttpAdapter";
import RoutingClientHttpRequestInterceptor from "../client/RoutingClientHttpRequestInterceptor";


export class MockFeignConfiguration implements FeignConfiguration {

    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getFeignClientExecutor = <T extends FeignProxyClient = FeignProxyClient>(client: T) => {
        return new DefaultFeignClientExecutor<T>(client);
    };

    getHttpAdapter = () => new MockHttpAdapter(this.baseUrl);

    getHttpClient = () => {
        const httpClient = new DefaultHttpClient(this.getHttpAdapter());
        const interceptors = [new RoutingClientHttpRequestInterceptor(this.baseUrl)];
        httpClient.setInterceptors(interceptors);
        return httpClient;
    };

    getRestTemplate = () => new RestTemplate(this.getHttpClient());


}
