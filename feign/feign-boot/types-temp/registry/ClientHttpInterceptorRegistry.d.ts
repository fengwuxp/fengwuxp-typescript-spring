import { InterceptorRegistry } from './InterceptorRegistry';
import ClientHttpInterceptorRegistration from "./ClientHttpInterceptorRegistration";
import { ClientHttpRequestInterceptor } from "fengwuxp-typescript-feign";
export default class ClientHttpInterceptorRegistry implements InterceptorRegistry {
    private clientHttpInterceptorRegistrations;
    addInterceptor: (interceptor: ClientHttpRequestInterceptor<import("fengwuxp-typescript-feign").HttpRequest>) => ClientHttpInterceptorRegistration;
    getInterceptors: () => any[];
}
