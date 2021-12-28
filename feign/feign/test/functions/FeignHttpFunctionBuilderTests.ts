import * as log4js from "log4js";
import MockFeignConfigurationTest from "../MockFeignConfigurationTest";
import {
    defaultApiModuleName,
    FeignClientType,
    FeignConfigurationRegistry,
    FeignHttpClientPromiseFunction,
    feignHttpFunctionBuilder
} from "../../src";

const logger = log4js.getLogger();
logger.level = 'debug';


describe("test functions feign client builder", () => {

    const mockFeignConfiguration = new MockFeignConfigurationTest();
    const httpAdapter = mockFeignConfiguration.getHttpAdapter();
    httpAdapter.setMockData("GET /api/test/v1/user/1", (req) => ({name: "test"}));

    FeignConfigurationRegistry.setFeignConfiguration(FeignClientType.HTTP, defaultApiModuleName, mockFeignConfiguration);
    const functionBuilder = feignHttpFunctionBuilder({value: "/api/test/v1"});

    test("test function build http client", async () => {
        const findById: FeignHttpClientPromiseFunction<{ id: number }, { name: string }> = functionBuilder.get({value: "/user/{id}"});
        const result = await findById({id: 1});
        expect(result).toEqual({name: "test"});
    }, 30 * 1000);

});

