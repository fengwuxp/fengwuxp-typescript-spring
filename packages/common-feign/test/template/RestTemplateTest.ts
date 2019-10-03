import * as log4js from "log4js";
import RestTemplate from "../../src/template/RestTemplate";

const logger = log4js.getLogger();
logger.level = 'debug';

describe("template test", () => {


    const restTemplate = new RestTemplate();

    test("get for object path variable", () => {

        restTemplate.getForObject(
            "http://a.b.com/member/{id}",
            [1],
            {}).then(() => {
        })
    });

    test("get for object query string", () => {

        restTemplate.getForObject(
            "http://a.b.com/members",
            {
                id: 1
            },
            {}).then(() => {

        })
    })
});
