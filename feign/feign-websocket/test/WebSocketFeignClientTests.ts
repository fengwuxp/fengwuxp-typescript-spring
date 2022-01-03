import * as log4js from "log4js";
import TestWebSocketFeignClient from "./TestWebSocketFeignClient";


const logger = log4js.getLogger();
logger.level = 'debug';


describe("test feign websocket client", () => {

    const testFeignClient = new TestWebSocketFeignClient();

    const sleep = (times) => {
        return new Promise((resolve) => {
            setTimeout(resolve, times)
        })
    };


    test("test feign websocket client send message", async () => {

        testFeignClient.createExample({name: "test"})

    }, 30 * 1000);

    test("test feign websocket client on message", async () => {

        const subscriber = testFeignClient.getExample((data) => {
            logger.info(data);
        });
        subscriber.remove();

    }, 30 * 1000);

});

