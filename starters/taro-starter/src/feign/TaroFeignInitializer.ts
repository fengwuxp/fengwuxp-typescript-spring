import {NetworkClientHttpRequestInterceptor,FeignConfigurationRegistry, RoutingClientHttpRequestInterceptor} from "fengwuxp-typescript-feign";
import TaroNetworkStatusListener from "./TaroNetworkStatusListener";


// new NetworkClientHttpRequestInterceptor<T>(new TaroNetworkStatusListener()),
// new RoutingClientHttpRequestInterceptor()

const x = {

    init() {
        FeignConfigurationRegistry.setDefaultFeignConfiguration(null);
    }
};
