import {HttpMethod} from "../constant/http/HttpMethod";
import {HttpRequest} from "../client/HttpRequest";
import SimplePathMatcher from "fengwuxp-common-utils/src/match/SimplePathMatcher";
import {PathMatcher} from "fengwuxp-common-utils/src/match/PathMatcher";

interface HttpHeader {
    name: string;
    value: string
}

export abstract class MappedInterceptor {

    protected includePatterns: string[];

    protected excludePatterns: string[];

    protected includeMethods: HttpMethod[];

    protected excludeMethods: HttpMethod[];

    protected includeHeaders: HttpHeader[];

    protected excludeHeaders: HttpHeader[];

    protected pathMatcher: PathMatcher = new SimplePathMatcher();


    constructor(includePatterns: string[],
                excludePatterns: string[],
                includeMethods: HttpMethod[],
                excludeMethods: HttpMethod[],
                includeHeaders?: string[][],
                excludeHeaders?: string[][],) {
        this.includePatterns = includePatterns;
        this.excludePatterns = excludePatterns;
        this.includeMethods = includeMethods;
        this.excludeMethods = excludeMethods;
        this.includeHeaders = this.converterHeaders(includeHeaders);
        this.excludeHeaders = this.converterHeaders(excludeHeaders);
    }


    /**
     * Determine a match for the given lookup path.
     * @param req
     * @return {@code true} if the interceptor applies to the given request path or http methods or http headers
     */
    public matches = (req: HttpRequest): boolean => {

        const sources = [req.url, req.method, req.headers];
        return ["Url", "Method", "Headers"].some((methodName, index) => {
            return this[`matches${methodName}`](sources[index]);
        });
    };

    /**
     * Determine a match for the given lookup path.
     * @param lookupPath the current request path
     * @param pathMatcher a path matcher for path pattern matching
     * @return {@code true} if the interceptor applies to the given request path
     */
    public matchesUrl = (lookupPath: string, pathMatcher?: PathMatcher): boolean => {
        const pathMatcherToUse = pathMatcher || this.pathMatcher;
        const {excludePatterns, includePatterns} = this;
        return this.doMatch(lookupPath, includePatterns, excludePatterns, (pattern: string, path: string) => {
            return pathMatcherToUse.match(pattern, path);
        })
    };

    /**
     * Determine a match for the given http method
     * @param method
     */
    public matchesMethod = (method: HttpMethod): boolean => {
        const {includeMethods, excludeMethods} = this;
        return this.doMatch(method, includeMethods, excludeMethods, (pattern: HttpMethod, path: HttpMethod) => {
            return pattern === path;
        })
    };

    /**
     * Determine a match for the given request headers
     * @param header
     */
    public matchesHeaders = (header: Record<string, string>): boolean => {
        return this.doMatch(header, this.includeHeaders, this.excludeHeaders, (pattern: HttpHeader, path: Record<string, string>) => {

            const {name, value} = pattern;
            const needMatchValue = value != null;
            const headerValue = header[name];

            if (needMatchValue) {
                return headerValue === value;
            }
            return headerValue != null;
        })
    };


    private doMatch = (path, includes: any[], excludes: any[], predicate: (pattern, path) => boolean) => {
        if (excludes != null) {
            const isMatch = excludes.some((pattern) => predicate(pattern, path));
            if (isMatch) {
                return false;
            }
        }
        if (includes == null || includes.length === 0) {
            return true
        }
        const isMatch = includes.some((pattern) => predicate(pattern, path));
        if (isMatch) {
            return true;
        }

        return false;
    };

    private converterHeaders = (headers: string[][]) => {
        if (headers == null) {
            return null;
        }

        return headers.map((items) => {
            return {
                name: items[0],
                value: items[1],
            }
        })
    }
}
