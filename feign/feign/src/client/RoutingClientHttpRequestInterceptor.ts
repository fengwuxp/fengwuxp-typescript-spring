import {ClientHttpRequestInterceptorInterface} from "./ClientHttpRequestInterceptor";
import {HttpRequest} from "./HttpRequest";
import {defaultApiModuleName} from "../constant/FeignConstVar";
import {appendRouteMapping, parseRequestUrl} from "../context/RquestUrlMappingHolder";


/**
 * If the url starts with @xxx, replace 'xxx' with the value of name='xxx' in the routeMapping
 * example url='lb://memberModule/find_member  routeMapping = {memberModule:"http://test.a.b.com/member"} ==> 'http://test.a.b.com/member/find_member'
 */
export default class RoutingClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest>
    implements ClientHttpRequestInterceptorInterface<T> {

    /**
     * mapping between api module and url
     */
    constructor(routeMapping: Record<string, string> | string) {
        if (typeof routeMapping === "string") {
            const defaultMap: Record<string, string> = {};
            defaultMap[defaultApiModuleName] = routeMapping;
            routeMapping = defaultMap;
        }
        appendRouteMapping(routeMapping);
    }

    intercept = async (req: T) => {
        req.url = parseRequestUrl(req.url);
        return req;
    }

}

