import { HttpAdapter } from "../HttpAdapter";
import { HttpRequest } from "../../client/HttpRequest";
import { HttpResponse } from "../../client/HttpResponse";
export declare type MockDataType = (options: HttpRequest) => Promise<any> | any;
/**
 * mock http adapter
 */
export default class MockHttpAdapter implements HttpAdapter {
    private resolveHttpResponse;
    protected mockDataSource: Record<string, MockDataType>;
    protected baseUrl: string;
    constructor(baseUrl: string, mockDataSource?: Record<string, any>);
    send: (req: HttpRequest) => Promise<HttpResponse<any>>;
    /**
     * set mock data
     * @param url
     * @param data
     */
    setMockData: (url: string, data: MockDataType) => void;
}
