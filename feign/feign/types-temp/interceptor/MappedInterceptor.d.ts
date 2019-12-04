import { HttpMethod } from "../constant/http/HttpMethod";
import { HttpRequest } from "../client/HttpRequest";
import { PathMatcher } from "fengwuxp-common-utils/src/match/PathMatcher";
interface HttpHeader {
    name: string;
    value: string;
}
export declare abstract class MappedInterceptor {
    protected includePatterns: string[];
    protected excludePatterns: string[];
    protected includeMethods: HttpMethod[];
    protected excludeMethods: HttpMethod[];
    protected includeHeaders: HttpHeader[];
    protected excludeHeaders: HttpHeader[];
    protected pathMatcher: PathMatcher;
    constructor(includePatterns: string[], excludePatterns: string[], includeMethods: HttpMethod[], excludeMethods: HttpMethod[], includeHeaders?: string[][], excludeHeaders?: string[][]);
    /**
     * Determine a match for the given lookup path.
     * @param req
     * @return {@code true} if the interceptor applies to the given request path or http methods or http headers
     */
    matches: (req: HttpRequest) => boolean;
    /**
     * Determine a match for the given lookup path.
     * @param lookupPath the current request path
     * @param pathMatcher a path matcher for path pattern matching
     * @return {@code true} if the interceptor applies to the given request path
     */
    matchesUrl: (lookupPath: string, pathMatcher?: PathMatcher) => boolean;
    /**
     * Determine a match for the given http method
     * @param method
     */
    matchesMethod: (method: HttpMethod) => boolean;
    /**
     * Determine a match for the given request headers
     * @param header
     */
    matchesHeaders: (header: Record<string, string>) => boolean;
    private doMatch;
    private converterHeaders;
}
export {};
