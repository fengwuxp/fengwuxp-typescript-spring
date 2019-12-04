import { ClientHttpRequestInterceptorInterface } from "./ClientHttpRequestInterceptor";
import { HttpRequest } from "./HttpRequest";
/**
 * If the url starts with @xxx, replace 'xxx' with the value of name='xxx' in the routeMapping
 * example url='@memberModule/find_member  routeMapping = {memberModule:"http://test.a.b.com/member"} ==> 'http://test.a.b.com/member/find_member'
 */
export default class RoutingClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest> implements ClientHttpRequestInterceptorInterface<T> {
    /**
     * mapping between api module and url
     */
    protected routeMapping: Record<string, string>;
    constructor(routeMapping: Record<string, string> | string);
    interceptor: (req: T) => Promise<T>;
}
