import {HttpAdapter} from "../HttpAdapter";
import {HttpRequest} from "../../client/HttpRequest";
import {HttpResponse} from "../../client/HttpResponse";
import {ResolveHttpResponse} from "../../resolve/ResolveHttpResponse";
import CommonResolveHttpResponse from "../../resolve/CommonResolveHttpResponse";


export type MockDataType = (options: HttpRequest) => Promise<any> | any;

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

    send = (req: HttpRequest): Promise<HttpResponse> => {
        console.log("mock http adapter", req);
        const {url} = req;
        const key = url.split("?")[0].replace(this.baseUrl, "");
        const result: MockDataType = this.mockDataSource[key];
        if (result == null) {
            const response: Response = {
                status: 404,
                statusText: "Not Found",
                ok: false,
                url,
                redirected: null,
                headers: null
            } as any;
            return Promise.reject(this.resolveHttpResponse.resolve(response));
        }

        if (typeof result === "function") {
            return result(req);
        }

        return Promise.resolve(result);
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
