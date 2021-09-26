import {
    CommonResolveHttpResponse,
    contentLengthName,
    contentTransferEncodingName,
    contentTypeName,
    HttpAdapter,
    HttpMediaType,
    HttpMethod,
    HttpResponse,
    matchMediaType,
    ResolveHttpResponse,
    responseIsFile,
    responseIsJson,
    responseIsText,
} from "fengwuxp-typescript-feign";
import {BrowserHttpRequest} from './BrowserHttpRequest';


// RequestInit prop names
const RequestInitAttrNames: string[] = [
    "referrer",
    "referrerPolicy",
    "credentials",
    "redirect",
    "cache",
    "integrity",
    "keepalive",
    "window"
];

/**
 *  browser http request adapter
 */
export default class BrowserHttpAdapter implements HttpAdapter<BrowserHttpRequest> {

    private readonly timeout: number;

    private consumes: HttpMediaType;

    private resolveHttpResponse: ResolveHttpResponse;

    /**
     *
     * @param timeout  default 5000ms
     * @param resolveHttpResponse
     * @param consumes  default 'application/json;charset=UTF-8'
     */
    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>, consumes?: HttpMediaType) {
        this.timeout = timeout || 5 * 1000;
        this.resolveHttpResponse = resolveHttpResponse || new CommonResolveHttpResponse();
        this.consumes = consumes;
    }

    send = (req: BrowserHttpRequest): Promise<HttpResponse> => {
        return new Promise<HttpResponse>((resolve, reject) => {
            const result = fetch(this.buildRequest(req)).then((response: Response) => {
                return this.parse(response).then((data) => {
                    //为了适配
                    response['data'] = data;
                    return this.resolveHttpResponse.resolve(response)
                });
            }).catch((response: Response) => {
                const data = this.resolveHttpResponse.resolve(response);
                data.data = response;
                return Promise.reject(data);
            });
            // 超时控制
            const timeId = setTimeout(() => {
                //丢弃请求
                console.log("browser fetch adapter request timeout", req);
                reject({
                    status: 502,
                    headers: null,
                    data: null,
                    ok: false,
                    statusText: `request timeout`
                });
            }, req.timeout || this.timeout);

            result.then(resolve)
                .catch(reject)
                .finally(() => {
                    //清除定时器
                    clearTimeout(timeId);
                });
        })

    };

    /**
     * build http request
     * @param {BrowserHttpRequest} request
     * @return {Request}
     */
    private buildRequest(request: BrowserHttpRequest): RequestInfo {
        let {
            url,
            method,
            headers,
            body,
            mode
        } = request;

        if (headers != null && matchMediaType(headers[contentTypeName] as HttpMediaType, HttpMediaType.MULTIPART_FORM_DATA)) {
            // remove content-type
            // @see {@link https://segmentfault.com/a/1190000010205162}
            delete headers[contentTypeName];
        }

        const reqMethod = HttpMethod[method];

        // build RequestInit
        const reqOptions = {
            method: reqMethod,
            headers,
            body,
            mode
        } as RequestInit;

        RequestInitAttrNames.forEach((name) => {
            const attr = request[name];
            if (attr == null) {
                return;
            }
            reqOptions[name] = attr;
        });
        return new Request(url, reqOptions);
    }


    /**
     * parse response data
     * @param response
     * @return {any}
     */
    private parse = (response: Response): Promise<any> => {


        const {getHeaderByName, consumes} = this;
        const headers = response.headers;

        if (response.body == null) {
            // 没有请求体
            if (response.ok) {
                return Promise.resolve();
            }
        }

        // Transfer-Encoding：chunked 情况下没有Content-length请求头
        if (!this.hasTransferEncoding(headers)) {
            /**
             *  在跨域的情况下需要加以下响应的请求头到，不然无法读取到content length
             *  response.addHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length");
             *  response.addHeader("Access-Control-Expose-Headers","Content-Type,Content-Length");
             */
            const contentLength = parseInt(getHeaderByName(headers, contentLengthName));
            // 降级模式
            const responseBodyIsEmpty = contentLength === 0;// || Object.is(contentLength, NaN);
            if (responseBodyIsEmpty) {
                return Promise.resolve();
            }
        }

        const responseMediaType: string = getHeaderByName(headers, contentTypeName) || consumes;
        if (responseMediaType == null) {
            // 未知的content-type
            return Promise.resolve(response);
        }
        const responseHeaders = {
            [contentTypeName]: responseMediaType
        };

        if (responseIsJson(responseHeaders)) {
            return this.parseJSON(response);
        } else if (responseIsText(responseHeaders)) {
            return this.parseText(response);
        } else {
            if (responseIsFile({
                ...responseHeaders,
                [contentTransferEncodingName]: getHeaderByName(headers, contentTransferEncodingName)
            })) {
                return this.paresArrayBuffer(response);
            } else {
                // const error = new Error(`not support： ${responseMediaType}`);
                // error['response'] = response;
                // throw error;
                return Promise.resolve(response)
            }

        }
    };

    private parseJSON = (response: Response): Promise<any> => {
        return response.json();
    }

    private parseText = (response: Response): Promise<string> => {
        return response.text();
    }

    private paresArrayBuffer = (response: Response): Promise<ArrayBuffer> => {
        return response.arrayBuffer();
    }

    // private paresBlob(response: Response): Promise<Blob> {
    //     return response.blob();
    // }

    // private paresFormData(response: Response): Promise<FormData> {
    //     return response.formData();
    // }


    private getHeaderByName = (headers: Headers, name: string) => {

        return headers.get(name) || headers.get(name.toLowerCase());
    };

    /**
     * http Transfer-Encoding
     * @param headers
     */
    private hasTransferEncoding = (headers: Headers) => {
        const name = 'Transfer-Encoding';
        const value = headers.get(name) || headers.get(name.toLowerCase());
        return value === "chunked";
    }
}
