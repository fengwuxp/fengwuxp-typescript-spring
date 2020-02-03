import * as log4js from "log4js";

const logger = log4js.getLogger();
logger.level = 'debug';


describe("test authentication manager", () => {

    const sleep = (times) => {
        return new Promise((resolve) => {
            setTimeout(resolve, times)
        })
    };


    test("test form authentication manager", () => {



    })


});

