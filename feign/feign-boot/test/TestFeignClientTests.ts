import * as log4js from "log4js";
import TestFeignClient from "./TestFeignClient";
import {ClientHttpInterceptorRegistry, FeignClientInterceptorRegistry, feignHttpConfigurationInitialize} from "../src";
import {
    defaultApiModuleName,
    FeignConfigurationRegistry,
    HttpMediaType,
    ProcessBarExecutorInterceptor,
    RoutingClientHttpRequestInterceptor,
} from "fengwuxp-typescript-feign";
import MockHttpAdapter from "./MockHttpAdapter";

const logger = log4js.getLogger();
logger.level = 'debug';

describe("test feign boot starter", () => {

    feignHttpConfigurationInitialize({

        apiSignatureStrategy: function () {
            return undefined;
        },

        defaultProduce: function () {
            return HttpMediaType.FORM_DATA;
        },

        httpAdapter: function () {
            return new MockHttpAdapter("http://test.abc.com/api");
        },

        registryClientHttpRequestInterceptors: function (interceptorRegistry: ClientHttpInterceptorRegistry) {
            interceptorRegistry.addInterceptor(new RoutingClientHttpRequestInterceptor("http://test.abc.com"));
        },

        registryFeignClientExecutorInterceptors: function (interceptorRegistry: FeignClientInterceptorRegistry) {
            interceptorRegistry.addInterceptor(new ProcessBarExecutorInterceptor({
                showProgressBar: () => {
                    return () => {}
                }
            })).addPathPatterns("/**");
        }
    });

    const defaultFeignConfiguration = FeignConfigurationRegistry.getFeignConfiguration("http", defaultApiModuleName);
    logger.debug("{}", defaultFeignConfiguration);

    const testFeignClient = new TestFeignClient();

    logger.debug("testFeignClient", testFeignClient);

    test("test feign boot starter example 1", async () => {

        const result = await testFeignClient.findMember({
            name: "张三",
            userName: "1",
            memberId: 1
        });
        console.log("http result", result);

    }, 10 * 1000);

    test("test get example", async () => {

        const result = await testFeignClient.getExample({
            id: 1,
            date: new Date(),
            test: "1"
        });
        console.log("http result", result);
    }, 10 * 1000);

    test("test retry", async () => {
        const result = await testFeignClient.testQuery({
            id: 1,
            date: new Date(),
            test: "1"
        });
        console.log("http result", result);
    }, 25 * 1000);

});

