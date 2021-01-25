import {HttpAdapter} from "../HttpAdapter";
import {HttpRequest} from "../../client/HttpRequest";
import {HttpResponse} from "../../client/HttpResponse";
import {ResolveHttpResponse} from "../../resolve/ResolveHttpResponse";
import CommonResolveHttpResponse from "../../resolve/CommonResolveHttpResponse";
import {contentTypeName, HttpMediaType, HttpMethod, mediaTypeIsEq} from "../..";
import {HttpStatus} from "../../constant/http/HttpStatus";


export type MockDataType = (options: HttpRequest) => Promise<any> | any;

const sleep = (times) => {
    return new Promise((resolve) => {
        setTimeout(resolve, times)
    })
};

/**
 * mock http adapter
 */
export default class MockHttpAdapter implements HttpAdapter {

    private resolveHttpResponse: ResolveHttpResponse = new CommonResolveHttpResponse();

    protected mockDataSource: Record<string, MockDataType> = {};

    protected baseUrl: string = "";

    //是否启用参数匹配
    // protected enabledParamsPattern: boolean = false;

    constructor(baseUrl: string, mockDataSource?: Record<string, any>) {
        this.baseUrl = baseUrl;
        this.mockDataSource = mockDataSource || {};
    }

    send = async (req: HttpRequest): Promise<HttpResponse> => {
        console.log("mock http adapter", req);
        const {url, method, headers} = req;
        if (mediaTypeIsEq(headers[contentTypeName] as HttpMediaType, HttpMediaType.MULTIPART_FORM_DATA)) {
            // remove content-type
            // @see {@link https://segmentfault.com/a/1190000010205162}
            delete headers[contentTypeName];
        }

        let pathname = url.split("?")[0].replace(this.baseUrl, "");
        if (!pathname.startsWith("/")) {
            pathname = `/${pathname}`;
        }
        const key = `${method} ${pathname}`;
        const result: MockDataType = this.mockDataSource[key];
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
                    headers: result
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
        }
    };


    /**
     * set mock data
     * @param url
     * @param data
     */
    setMockData = (url: string, data: MockDataType) => {
        this.mockDataSource[url] = data;
    }


}
