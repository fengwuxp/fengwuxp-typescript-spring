import * as log4js from "log4js";
import RestTemplate from "../../src/template/RestTemplate";
import DefaultHttpClient from "../../src/client/DefaultHttpClient";
import MockHttpAdapter from "../../src/adapter/mock/MockHttpAdapter";
import {HttpMediaType} from "../../src/constant/http/HttpMediaType";

const logger = log4js.getLogger();
logger.level = 'debug';

describe("template test", () => {


    const defaultHttpClient = new DefaultHttpClient(
        new MockHttpAdapter("http://a.b.com/api"),
        HttpMediaType.FORM_DATA);
    const restTemplate = new RestTemplate(defaultHttpClient);

    test("get for object path variable", async () => {

        const httpResponse = await restTemplate.getForObject(
            "http://a.b.com/member/{id}",
            [1],
            {}).then((data) => {
            logger.debug("data", data);
            return data
        });
        logger.debug("httpResponse", httpResponse);
    }, 10 * 1000);

    test("get for object query string", () => {

        restTemplate.getForObject(
            "http://a.b.com/members",
            {
                id: 1,
                name: "李四"
            },
            {}).then(() => {

        })
    });

    test("post for object query string", async () => {

        const httpResponse = await restTemplate.postForEntity(
            "http://a.b.com/members",
            {
                id: 1,
                name: "李四",
                html: ""
            },
            {
                age: 2
            });
        logger.debug("httpResponse", httpResponse);
    }, 10 * 1000);
})
;
