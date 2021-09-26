import {
    CommonResolveHttpResponse,
    contentTypeName,
    HttpAdapter,
    HttpMediaType,
    HttpMethod,
    HttpResponse,
    matchMediaType,
    ResolveHttpResponse
} from "fengwuxp-typescript-feign";
import {ReactNativeHttpRequest} from './ReactNativeHttpRequest';


// RequestInit prop names
const RequestInitAttrNames: string[] = [
    "referrer",
    "referrerPolicy",
    "credentials",
    "redirect",
    "cache",
    "integrity",
    "keepalive"
    // "window"
];

/**
 *  react-native http request adapter
 */
export default class ReactNativeHttpAdapter implements HttpAdapter<ReactNativeHttpRequest> {

    private readonly timeout: number;

    private readonly resolveHttpResponse: ResolveHttpResponse;

    /**
     *
     * @param timeout  default 5000ms
     * @param resolveHttpResponse
     */
    constructor(timeout?: number, resolveHttpResponse?: ResolveHttpResponse<any>) {
        this.timeout = timeout || 5 * 1000;
        this.resolveHttpResponse = resolveHttpResponse || new CommonResolveHttpResponse();
    }

    send = (req: ReactNativeHttpRequest): Promise<HttpResponse> => {
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
            //超时控制
            const timeId = setTimeout(() => {
                //丢弃请求
                console.log("react-native fetch adapter request timeout", req);
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
     * @param {ReactNativeHttpRequest} request
     * @return {Request}
     */
    private buildRequest(request: ReactNativeHttpRequest): RequestInfo {
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

        const headers = response.headers["map"];
        if (headers["content-length"] == 0) {
            //没有响应的内容
            return Promise.resolve();
        }

        const responseMediaType: string = headers["content-type"];

        if (matchMediaType(responseMediaType, HttpMediaType.APPLICATION_JSON_UTF8)) {
            return this.parseJSON(response);
        } else if (matchMediaType(responseMediaType, HttpMediaType.TEXT)) {
            return this.parseText(response);
        } else if (matchMediaType(responseMediaType, HttpMediaType.HTML)) {
            return this.parseText(response);
        } else if (matchMediaType(responseMediaType, HttpMediaType.APPLICATION_STREAM)) {
            return this.paresBlob(response);
        } else {
            const error = new Error(`not support： ${responseMediaType}`);
            error['response'] = response;
            throw error;
        }
    };

    private parseJSON = (response: Response): Promise<any> => {
        return response.json();
    }

    private parseText = (response: Response): Promise<string> => {
        return response.text();
    }

    private paresBlob = (response: Response): Promise<Blob> => {
        return response.blob();
    }
}
