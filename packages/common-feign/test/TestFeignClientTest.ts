import * as log4js from "log4js";
import TestFeignClient from "./TestFeignClient";
import FeignConfigurationRegistry from "../src/configuration/FeignConfigurationRegistry";
import {BrowserFeignConfiguration} from "../src/configuration/BrowserFeignConfiguration";

const logger = log4js.getLogger();
logger.level = 'debug';

describe("test feign client", () => {

    FeignConfigurationRegistry.setDefaultFeignConfiguration(new BrowserFeignConfiguration());

    const testFeignClient = new TestFeignClient();


    test("test feign client", async () => {

        const result = await testFeignClient.findMember({userName: "1", memberId: 1});
        console.log("http result", result);
    }, 10 * 1000);

});
