import {
    ClientHttpRequestInterceptorInterface
} from "./ClientHttpRequestInterceptor";
import {HttpRequest} from "./HttpRequest";
import {defaultApiModuleName} from "../constant/FeignConstVar";


/**
 * If the url starts with @xxx, replace 'xxx' with the value of name='xxx' in the routeMapping
 * example url='@memberModule/find_member  routeMapping = {memberModule:"http://test.a.b.com/member"} ==> 'http://test.a.b.com/member/find_member'
 */
export default class RoutingClientHttpRequestInterceptor<T extends HttpRequest = HttpRequest>
    implements ClientHttpRequestInterceptorInterface<T> {

    protected routeMapping: Record<string, string>;

    constructor(routeMapping: Record<string, string> | string) {
        if (typeof routeMapping === "string") {
            const defaultMap: Record<string, string> = {};
            defaultMap[defaultApiModuleName] = routeMapping;
            routeMapping = defaultMap;
        }
        this.routeMapping = routeMapping;
    }

    interceptor = async (req: T) => {
        req.url = routing(req.url, this.routeMapping);
        return req;
    }

}

const routing = (url: string, routeMapping: Record<string, string>) => {
    if (/^(http|https)/.test(url)) {
        //uri
        return normalizeUrl(url);
    }
    if (!/^(@)/.test(url)) {
        throw  new Error(`illegal routing url -> ${url}`);
    }

    //抓取api模块名称并且进行替换
    const searchValue = /^@(.+?)\//;

    return normalizeUrl(url.replace(searchValue, ($1, $2) => {
        const domain = routeMapping[$2];
        return domain.endsWith("/") ? domain : `${domain}/`;
    }));
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
