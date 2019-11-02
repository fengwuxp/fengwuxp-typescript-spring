import {HttpAdapter} from "../../../../../packages/feign/src/adapter/HttpAdapter";
import {NodeHttpRequest} from './NodeHttpRequest';
import {HttpResponse} from '../../../../../packages/feign/src/client/HttpResponse';
import {ResolveHttpResponse} from "../../../../../packages/feign/src/resolve/ResolveHttpResponse";
import CommonResolveHttpResponse from "../../../../../packages/feign/src/resolve/CommonResolveHttpResponse";
import request from "request";
import {mediaTypeIsEq} from "../../../../../packages/feign/src/utils/MediaTypeUtil";
import {HttpMediaType} from "../../../../../packages/feign/src/constant/http/HttpMediaType";
import {contentTypeName} from "../../../../../packages/feign/src/constant/FeignConstVar";

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
                        statusText: error.message,
                        status: error.code
                    }));
                }
            });
        });
    };


    private buildOption = (options: NodeHttpRequest) => {

        const {headers, body} = options;
        const contentType = headers[contentTypeName];
        if (mediaTypeIsEq(contentType as HttpMediaType, HttpMediaType.FORM_DATA)) {
            return {
                form: body
            }
        } else if (mediaTypeIsEq(contentType as HttpMediaType, HttpMediaType.APPLICATION_JSON)) {
            return {
                body: body
            }
        } else if (mediaTypeIsEq(contentType as HttpMediaType, HttpMediaType.MULTIPART_FORM_DATA)) {
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

        if (!response.ok) {
            return Promise.reject(null);
        }
        const {body, headers} = response;
        const responseMediaType: string = headers[contentTypeName];

        if (mediaTypeIsEq(responseMediaType, HttpMediaType.APPLICATION_JSON_UTF8)) {
            return body == null ? body : JSON.parse(body);
        } else if (mediaTypeIsEq(responseMediaType, HttpMediaType.TEXT)) {
            return body;
        } else if (mediaTypeIsEq(responseMediaType, HttpMediaType.HTML)) {
            return body;
        } else if (mediaTypeIsEq(responseMediaType, HttpMediaType.APPLICATION_STREAM)) {
            return body;
        } else {
            const error = new Error(`not support： ${responseMediaType}`);
            error['response'] = response;
            throw error;
        }
    }

}
