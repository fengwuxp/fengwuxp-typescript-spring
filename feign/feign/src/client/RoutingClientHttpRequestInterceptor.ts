import {ClientHttpRequestInterceptorInterface} from "./ClientHttpRequestInterceptor";
import {HttpRequest} from "./HttpRequest";
import {defaultApiModuleName} from "../constant/FeignConstVar";
import {appendRouteMapping} from "../context/FiegnMappingHolder";


/**
 * If the url starts with @xxx, replace 'xxx' with the value of name='xxx' in the routeMapping
 * example url='@memberModule/find_member  routeMapping = {memberModule:"http://test.a.b.com/member"} ==> 'http://test.a.b.com/member/find_member'
 */
export default class RoutingClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest>
    implements ClientHttpRequestInterceptorInterface<T> {

    /**
     * mapping between api module and url
     */
    protected routeMapping: Record<string, string>;

    constructor(routeMapping: Record<string, string> | string) {
        if (typeof routeMapping === "string") {
            const defaultMap: Record<string, string> = {};
            defaultMap[defaultApiModuleName] = routeMapping;
            routeMapping = defaultMap;
        }
        appendRouteMapping(routeMapping);
        this.routeMapping = routeMapping;
    }

    interceptor = async (req: T) => {
        req.url = routing(req.url, this.routeMapping);
        return req;
    }

}

const ROUTE_CACHE: Map<string, string> = new Map<string, string>();

export const routing = (url: string, routeMapping: Record<string, string>) => {
    if (/^(http|https)/.test(url)) {
        //uri
        return normalizeUrl(url);
    }
    if (!/^(@)/.test(url)) {
        throw  new Error(`illegal routing url -> ${url}`);
    }
    let realUrl = ROUTE_CACHE.get(url);
    if (realUrl != null) {
        return realUrl;
    }
    //抓取api模块名称并且进行替换
    const searchValue = /^@(.+?)\//;
    realUrl = normalizeUrl(url.replace(searchValue, ($1, $2) => {
        const domain = routeMapping[$2];
        if (domain == null) {
            return "";
        }
        return domain.endsWith("/") ? domain : `${domain}/`;
    }));
    ROUTE_CACHE.set(url, realUrl);
    return realUrl;
};

/**
 * Remove duplicate slashes if not preceded by a protocol
 * @param url
 */
const normalizeUrl = (url: string): string => {
    return url.replace(/((?!:).|^)\/{2,}/g, (_, p1) => {
        if (/^(?!\/)/g.test(p1)) {
            return `${p1}/`;
        }

        return '/';
    });
};
