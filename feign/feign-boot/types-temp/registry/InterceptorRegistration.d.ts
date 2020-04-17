import { HttpMethod } from "fengwuxp-typescript-feign";
export declare abstract class InterceptorRegistration {
    protected includePatterns: string[];
    protected excludePatterns: string[];
    protected includeMethods: HttpMethod[];
    protected excludeMethods: HttpMethod[];
    protected includeHeaders: string[][];
    protected excludeHeaders: string[][];
    protected interceptor: any;
    constructor(interceptor: any);
    addPathPatterns: (...patterns: string[]) => this;
    excludePathPatterns: (...patterns: string[]) => this;
    addHttpMethods: (...methods: HttpMethod[]) => this;
    excludeHttpMethods: (...methods: HttpMethod[]) => this;
    /**
     * @param headers  example: ["header name","header value"]  header value If it exists, it will be compared
     */
    addHeadersPatterns: (...headers: string[][]) => this;
    excludeHeadersPatterns: (...headers: string[][]) => this;
    abstract getInterceptor: () => any;
}
