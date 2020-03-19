/**
 * 路由配置
 * @key  模块名称
 * @value  模块对应的接口请求地址
 */
const ROUTE_MAPPING: Record<string, string> = {};

/**
 * 路由缓存
 * @key  url
 */
const ROUTE_CACHE: Map<string, string> = new Map<string, string>();

/**
 * 根据 {@see ROUTE_MAPPING} 的配置进行url合并
 * @param url             请求的url  格式 @模块名称/uri==>  例如：'@default/api/xxx/test'
 * @param routeMapping    路由配置
 */
const routing = (url: string, routeMapping: Record<string, string>) => {
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

/**
 * routing url
 * @param url
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


