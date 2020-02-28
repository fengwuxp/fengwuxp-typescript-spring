import {RequestMappingOptions} from "../annotations/mapping/Mapping";
import {HttpMethod} from "../constant/http/HttpMethod";
import {routing} from "../client/RoutingClientHttpRequestInterceptor";


// mapping option cache
const MAPPING_CACHE: Map<string, RequestMappingOptions> = new Map<string, RequestMappingOptions>();

const getKey = (url: string, method: HttpMethod | string = HttpMethod.GET) => {
    const [uri] = url.split("?");
    return `${method}__${uri}`;
};


const ROUTE_MAPPING: Record<string, any> = {};

export const appendRouteMapping = (routeMapping: Record<string, any>) => {

    for (const key in routeMapping) {
        ROUTE_MAPPING[key] = routeMapping[key];
    }
};

/**
 * 保存 mappingOptions
 * @param url
 * @param options
 */
export const setMappingOptions = (url: string, options: RequestMappingOptions): void => {

    const {method} = options;
    const key = getKey(routing(url, ROUTE_MAPPING), method);
    if (MAPPING_CACHE.has(key)) {
        return;
    }
    MAPPING_CACHE.set(key, options);
};

export const getMappingOptions = (url: string, method: HttpMethod | string): RequestMappingOptions => {
    const key = getKey(url, method);
    return MAPPING_CACHE.get(key);
};
