import { InterceptorRegistration } from "./InterceptorRegistration";
import { ClientHttpRequestInterceptor, MappedClientHttpRequestInterceptor } from "fengwuxp-typescript-feign";
/**
 * client http interceptor registration
 */
export default class ClientHttpInterceptorRegistration extends InterceptorRegistration {
    constructor(clientInterceptor: ClientHttpRequestInterceptor);
    getInterceptor: () => MappedClientHttpRequestInterceptor<import("fengwuxp-typescript-feign").HttpRequest>;
}
