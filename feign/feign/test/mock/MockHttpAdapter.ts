import {HttpAdapter} from "../../src/adapter/HttpAdapter";
import {HttpRequest} from "../../src/client/HttpRequest";
import {HttpResponse} from "../../src/client/HttpResponse";
import {ResolveHttpResponse} from "../../src/resolve/ResolveHttpResponse";
import CommonResolveHttpResponse from "../../src/resolve/CommonResolveHttpResponse";
import {contentTypeName, HttpMediaType, HttpMethod, matchMediaType} from "../../src";
import {HttpStatus} from "../../src/constant/http/HttpStatus";
import * as log4js from "log4js";

const logger = log4js.getLogger();
logger.level = 'debug';

export type MockDataSupplier = (options: HttpRequest) => any

const sleep = (times) => {
    return new Promise((resolve) => {
        setTimeout(resolve, times)
    })
};

/**
 * mock http adapter
 */
export default class MockHttpAdapter implements HttpAdapter {

    private readonly resolveHttpResponse: ResolveHttpResponse = new CommonResolveHttpResponse();

    private readonly mockDataSource: Record<string, MockDataSupplier> = {};

    private readonly baseUrl: string = "";

    //是否启用参数匹配
    // protected enabledParamsPattern: boolean = false;

    constructor(baseUrl: string, mockDataSource?: Record<string, MockDataSupplier>) {
        this.baseUrl = baseUrl;
        this.mockDataSource = mockDataSource ?? {};
    }

    send = async (req: HttpRequest): Promise<HttpResponse> => {
        logger.debug("[MockHttpAdapter] send ", req);
        const {url, method, headers} = req;
        if (matchMediaType(headers[contentTypeName] as HttpMediaType, HttpMediaType.MULTIPART_FORM_DATA)) {
            // remove content-type
            // @see {@link https://segmentfault.com/a/1190000010205162}
            delete headers[contentTypeName];
        }

        const result: MockDataSupplier = this.getMockData(method, url);
        const isFailure = result == null;
        if (isFailure) {
            const response: Response = {
                status: HttpStatus.NOT_FOUND,
                statusText: "Not Found",
                ok: false,
                url,
                redirected: null,
                headers: null
            } as any;
            return Promise.reject(this.resolveHttpResponse.resolve(response));
        } else {
            if (method == HttpMethod.HEAD) {
                return Promise.resolve(this.resolveHttpResponse.resolve({
                    status: HttpStatus.OK,
                    statusText: null,
                    data: req,
                    ok: true,
                    url,
                    redirected: null,
                    headers: result(req)
                }));
            }
            return Promise.resolve(this.resolveHttpResponse.resolve({
                status: HttpStatus.OK,
                statusText: null,
                data: result(req),
                ok: true,
                url,
                redirected: null,
                headers: null
            }));
        }
    };


    /**
     * set mock data
     * @param pattern
     * @param supplier
     */
    setMockData = (pattern: string, supplier: MockDataSupplier) => {
        this.mockDataSource[pattern] = supplier;
    }


    getMockData = (method: string, url: string): MockDataSupplier => {
        let pathname = url.split("?")[0].replace(this.baseUrl, "");
        if (!pathname.startsWith("/")) {
            pathname = `/${pathname}`;
        }
        const mockDataSource = this.mockDataSource;
        return mockDataSource[`${method.toUpperCase()} ${pathname}`];
    }


}
