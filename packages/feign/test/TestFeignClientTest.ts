import * as log4js from "log4js";
import TestFeignClient from "./TestFeignClient";
import FeignConfigurationRegistry from "../src/configuration/FeignConfigurationRegistry";
import {AbstractBrowserFeignConfiguration} from "../../../boot/feign-boot/src/configuration/AbstractBrowserFeignConfiguration";

class BrowserFeignConfiguration extends AbstractBrowserFeignConfiguration {


    constructor() {
        super();
    }
}

const logger = log4js.getLogger();
logger.level = 'debug';

describe("test feign client", () => {

    FeignConfigurationRegistry.setDefaultFeignConfiguration(new BrowserFeignConfiguration());

    const testFeignClient = new TestFeignClient();


    test("test feign client", async () => {

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

