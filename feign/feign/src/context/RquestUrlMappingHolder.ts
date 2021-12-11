import {HTTP_SCHEMA, LB_SCHEMA} from "../constant/FeignConstVar";

/**
 * 路由配置
 * @key  模块名称
 * @value  模块对应的接口请求地址
 */
const ROUTE_MAPPING: Record<string, string> = {};

/**
 * 根据 {@see ROUTE_MAPPING} 的配置进行url合并
 * @param url             请求的url  格式 @模块名称/uri==>  例如：'@default/api/xxx/test'
 * @param routeMapping    路由配置
 */
const routing = (url: string, routeMapping: Record<string, string>) => {
    if (/^(http:\/\/|https:\/\/)/.test(url)) {
        // uri
        return normalizeUrl(url);
    }

    if (!url.startsWith(LB_SCHEMA)) {
        throw  new Error(`illegal routing url -> ${url}`);
    }

    const _url = new URL(url.replace(LB_SCHEMA, HTTP_SCHEMA));
    // TODO 增加负载均衡支持
    const serviceId = _url.host
    const serviceUri = routeMapping[serviceId];
    if (serviceUri.startsWith("/")){
        return normalizeUrl(`${serviceUri}/${_url.pathname}${_url.search}`);
    }
    const routeUrl = new URL(serviceUri);
    _url.host = routeUrl.host;
    _url.pathname = `${routeUrl.pathname}${_url.pathname}`;
    return normalizeUrl(_url.toString());
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

/**
 * routing url
 * @param url  example: @default/api/xxx
 */
export const parseRequestUrl = (url: string) => {
    return routing(url, ROUTE_MAPPING)
};

/**
 * 添加路由配置
 * @param routeMapping
 */
export const appendRouteMapping = (routeMapping: Record<string, string>) => {
    for (const key in routeMapping) {
        ROUTE_MAPPING[key] = routeMapping[key];
    }
};


