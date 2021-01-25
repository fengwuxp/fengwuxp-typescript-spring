import * as log4js from "log4js";
import TestFeignClient from "./TestFeignClient";
import {ClientHttpInterceptorRegistry, FeignClientInterceptorRegistry, feignConfigurationInitializer} from "../src";
import {
    FeignConfigurationRegistry,
    HttpMediaType,
    NetworkClientHttpRequestInterceptor, NetworkStatus, ProcessBarExecutorInterceptor,
    RoutingClientHttpRequestInterceptor,
} from "fengwuxp-typescript-feign";
import MockHttpAdapter from "../../feign/test/mock/MockHttpAdapter";
import {ProgressBarOptions} from "../../feign/src/FeignRequestOptions";



const logger = log4js.getLogger();
logger.level = 'debug';

describe("test feign boot starter", () => {

    feignConfigurationInitializer({
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
                hideProgressBar: function () {
                }, showProgressBar: function (p1: ProgressBarOptions) {
                }

            })).addPathPatterns("/**");
        }
    });

    const defaultFeignConfiguration = FeignConfigurationRegistry.getDefaultFeignConfiguration();
    logger.debug("{}",defaultFeignConfiguration);

    const testFeignClient = new TestFeignClient();

    logger.debug("testFeignClient",testFeignClient);

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

