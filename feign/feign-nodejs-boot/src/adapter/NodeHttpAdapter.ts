import {
    CommonResolveHttpResponse, contentTypeName,
    HttpAdapter, HttpMediaType,
    HttpResponse,
    matchMediaType,
    ResolveHttpResponse
} from "fengwuxp-typescript-feign";
import {NodeHttpRequest} from "./NodeHttpRequest";
import request from "request";

/**
 * node js adapter
 */
export default class NodeHttpAdapter implements HttpAdapter<NodeHttpRequest> {

    private timeout: number;

    private resolveHttpResponse: ResolveHttpResponse;


    /**
     *
     * @param timeout  default 10000ms
     * @param resolveHttpResponse
     */
    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>) {
        this.timeout = timeout || 10 * 1000;
        this.resolveHttpResponse = resolveHttpResponse || new CommonResolveHttpResponse();
    }

    send = (req: NodeHttpRequest): Promise<HttpResponse> => {

        const {url, method, headers, timeout, jar, auth, oauth} = req;

        return new Promise<HttpResponse>((resolve, reject) => {

            request({
                url,
                method,
                headers,
                jar,
                auth,
                oauth,
                timeout,
                ...this.buildOption(req)
            }, (error, response) => {
                if (!error && response.statusCode >= 200 && response.statusCode < 300) {
                    resolve(this.resolveHttpResponse.resolve({
                        ok: true,
                        statusText: response.statusMessage,
                        status: response.statusCode,
                        headers: response.headers,
                        data: this.parse(response)
                    }));
                } else {
                    reject(this.resolveHttpResponse.resolve({
                        ok: false,
                        statusText: error == null ? response.statusCode : error.message,
                        status: response.statusCode,
                        data: this.parse(response)
                    }));
                }
            });
        });
    };


    private buildOption = (options: NodeHttpRequest) => {

        const {headers, body} = options;
        const contentType = headers[contentTypeName];
        if (matchMediaType(contentType as HttpMediaType, HttpMediaType.FORM_DATA)) {
            return {
                form: body
            }
        } else if (matchMediaType(contentType as HttpMediaType, HttpMediaType.APPLICATION_JSON)) {
            return {
                body: body
            }
        } else if (matchMediaType(contentType as HttpMediaType, HttpMediaType.MULTIPART_FORM_DATA)) {
            return {
                formData: body
            }
        }

        return {};
    };


    /**
     * parse response data
     * @param response
     * @return {any}
     */
    private parse(response: any): Promise<any> {

        const {body, headers} = response;
        const responseMediaType: string = headers[contentTypeName];

        if (matchMediaType(responseMediaType, HttpMediaType.APPLICATION_JSON_UTF8)) {
            return body == null ? body : JSON.parse(body);
        } else if (matchMediaType(responseMediaType, HttpMediaType.TEXT)) {
            return body;
        } else if (matchMediaType(responseMediaType, HttpMediaType.HTML)) {
            return body;
        } else if (matchMediaType(responseMediaType, HttpMediaType.APPLICATION_STREAM)) {
            return body;
        } else {
            const error = new Error(`not support： ${responseMediaType}`);
            error['response'] = response;
            throw error;
        }
    }

}
