import {
    CommonResolveHttpResponse,
    contentLengthName,
    contentTypeName,
    HttpAdapter,
    HttpMediaType,
    HttpMethod,
    HttpResponse,
    mediaTypeIsEq,
    ResolveHttpResponse
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

    private timeout: number;

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
        this.consumes = consumes || HttpMediaType.APPLICATION_JSON_UTF8;
    }

    send = (req: BrowserHttpRequest): Promise<HttpResponse> => {

        return Promise.race<HttpResponse>([
            fetch(this.buildRequest(req)).then((response: Response) => {
                return this.parse(response).then((data) => {
                    //为了适配
                    response['data'] = data;
                    return this.resolveHttpResponse.resolve(response)
                });
            }).catch((response: Response) => {
                const data = this.resolveHttpResponse.resolve(response);
                data.data = response;
                return Promise.reject(data);
            }),
            new Promise<HttpResponse>((resolve, reject) => {
                //超时控制
                setTimeout(() => {
                    //丢弃请求
                    console.debug("web fetch adapter request timeout");
                    reject({
                        status: 502,
                        headers: null,
                        data: null,
                        ok: false,
                        statusText: `request timeout`
                    });
                }, req.timeout || this.timeout);
            })
        ])

        // return new Promise((resolve, reject) => {
        //
        //     const p = fetch(this.buildRequest(req)).then((response: Response) => {
        //         return this.parse(response).then((data) => {
        //             //为了适配
        //             response['data'] = data;
        //             return this.resolveHttpResponse.resolve(response)
        //         });
        //     }).catch((response: Response) => {
        //         const data = this.resolveHttpResponse.resolve(response);
        //         data.data = response;
        //         return Promise.reject(data);
        //     });
        //     //超时控制
        //     const timeId = setTimeout(() => {
        //         //丢弃请求
        //         console.debug("web fetch adapter request timeout");
        //         reject({
        //             status: 502,
        //             headers: null,
        //             data: null,
        //             ok: false,
        //             statusText: `request timeout`
        //         });
        //     }, req.timeout || this.timeout);
        //
        //     p.then(resolve)
        //         .catch(reject)
        //         .finally(() => {
        //             //清除定时器
        //             clearTimeout(timeId);
        //         });
        // })

    };


    /**
     * build http request
     * @param {HttpRequest} request
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

        if (mediaTypeIsEq(headers[contentTypeName] as HttpMediaType, HttpMediaType.MULTIPART_FORM_DATA)) {
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

        const {consumes, getHeaderByName} = this;

        const headers = response.headers;
        if (parseInt(getHeaderByName(headers, contentLengthName)) === 0) {
            return Promise.resolve();
        }
        const responseMediaType: string = getHeaderByName(headers, contentTypeName) || consumes;

        if (mediaTypeIsEq(responseMediaType, HttpMediaType.APPLICATION_JSON_UTF8)) {

            return this.parseJSON(response);
        } else if (mediaTypeIsEq(responseMediaType, HttpMediaType.TEXT)) {

            return this.parseText(response);
        } else if (mediaTypeIsEq(responseMediaType, HttpMediaType.HTML)) {

            return this.parseText(response);
        } else if (mediaTypeIsEq(responseMediaType, HttpMediaType.APPLICATION_STREAM)) {

            return this.paresBlob(response);
        } else {
            const error = new Error(`not support： ${responseMediaType}`);
            error['response'] = response;
            throw error;
        }
    };

    private parseJSON(response: Response): Promise<any> {
        return response.json();
    }

    private parseText(response: Response): Promise<string> {
        return response.text();
    }

    private paresArrayBuffer(response: Response): Promise<ArrayBuffer> {
        return response.arrayBuffer();
    }

    private paresBlob(response: Response): Promise<Blob> {
        return response.blob();
    }

    // private paresFormData(response: Response): Promise<FormData> {
    //     return response.formData();
    // }


    private getHeaderByName = (headers: Headers, name: string) => {

        return headers.get(name) || headers.get(name.toLowerCase());
    }
}
