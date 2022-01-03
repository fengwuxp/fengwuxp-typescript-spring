import {
    CommonResolveHttpResponse,
    contentTypeName,
    HttpAdapter,
    HttpMediaType,
    HttpMethod,
    HttpRequest,
    HttpResponse,
    HttpStatus,
    matchMediaType,
    ResolveHttpResponse
} from 'fengwuxp-typescript-feign';

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

    private readonly baseUrl: string = "";

    //是否启用参数匹配
    // protected enabledParamsPattern: boolean = false;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    send = async (req: HttpRequest): Promise<HttpResponse> => {
        logger.debug("[MockHttpAdapter] send ", req);
        const {url, method, headers} = req;
        if (matchMediaType(headers[contentTypeName] as HttpMediaType, HttpMediaType.MULTIPART_FORM_DATA)) {
            // remove content-type
            // @see {@link https://segmentfault.com/a/1190000010205162}
            delete headers[contentTypeName];
        }

        if (method == HttpMethod.HEAD) {
            return Promise.resolve(this.resolveHttpResponse.resolve({
                status: HttpStatus.OK,
                statusText: null,
                data: req,
                ok: true,
                url,
                redirected: null,
                headers: {}
            }));
        }
        return Promise.resolve(this.resolveHttpResponse.resolve({
            status: HttpStatus.OK,
            statusText: null,
            data: req,
            ok: true,
            url,
            redirected: null,
            headers: null
        }));
    };
}
