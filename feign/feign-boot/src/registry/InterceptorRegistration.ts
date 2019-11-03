import {HttpMethod} from "fengwuxp-typescript-feign";


export abstract class InterceptorRegistration {

    protected includePatterns: string[] = [];

    protected excludePatterns: string[] = [];

    protected includeMethods: HttpMethod[] = [];

    protected excludeMethods: HttpMethod[] = [];

    protected includeHeaders: string[][] = [];

    protected excludeHeaders: string[][] = [];

    protected interceptor;


    constructor(interceptor) {
        this.interceptor = interceptor;
    }

    addPathPatterns = (...patterns: string[]): this => {
        this.includePatterns.push(...patterns);
        return this;
    };

    excludePathPatterns = (...patterns: string[]): this => {
        this.excludePatterns.push(...patterns);
        return this;
    };

    addHttpMethods = (...methods: HttpMethod[]): this => {
        this.includeMethods.push(...methods);
        return this;
    };

    excludeHttpMethods = (...methods: HttpMethod[]): this => {
        this.excludeMethods.push(...methods);
        return this;
    };

    /**
     * @param headers  example: ["header name","header value"]  header value If it exists, it will be compared
     */
    addHeadersPatterns = (...headers: string[][]): this => {
        this.includeHeaders.push(...headers);
        return this;
    };

    excludeHeadersPatterns = (...headers: string[][]): this => {
        this.excludeHeaders.push(...headers);
        return this;
    };

    public abstract getInterceptor: () => any;

}
