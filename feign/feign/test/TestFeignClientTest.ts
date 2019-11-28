import * as log4js from "log4js";
import TestFeignClient from "./TestFeignClient";
import FeignConfigurationRegistry from "../src/configuration/FeignConfigurationRegistry";
import {MockFeignConfiguration} from "../src/configuration/MockFeignConfiguration";


const logger = log4js.getLogger();
logger.level = 'debug';

describe("test feign client", () => {

    FeignConfigurationRegistry.setDefaultFeignConfiguration(new MockFeignConfiguration("http://test.ac.com/api/"));

    const testFeignClient = new TestFeignClient();


    test("test feign client", async () => {

        try {
            const result = await testFeignClient.findMember({
                name: "张三",
                userName: "1",
                memberId: 1
            });
            console.log("http result", result);
        } catch (e) {
            logger.error(e)
        }
    }, 10 * 1000);

    test("test get example", async () => {

        try {
            const result = await testFeignClient.getExample({
                id: 1,
                date: new Date(),
                test: "1"
            });
            console.log("http result", result);
        } catch (e) {
            logger.error(e)
        }
    }, 10 * 1000);

    test("test retry", async () => {

        try {
            const result = await testFeignClient.testQuery({
                id: 1,
                date: new Date(),
                test: "1"
            });
            console.log("http result", result);
        } catch (e) {
            logger.error(e)
        }
    }, 25 * 1000);

    test("test delete member", async () => {

        try {
            const result = await testFeignClient.deleteMember({
              memberId:1
            });
            console.log("http result", result);
        } catch (e) {
            logger.error("-------->",e)
        }
    }, 25 * 1000);

});

