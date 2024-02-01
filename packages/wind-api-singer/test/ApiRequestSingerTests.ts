import * as log4js from "log4js";
import {genSignatureText, getCanonicalizedQueryString} from "../src/ApiRequestSinger";

const logger = log4js.getLogger();
logger.level = 'debug';

describe("test api sign", () => {

    const baseRequest = {
        requestPath: "/api/v1/example/users",
        nonce: "jlj3rn2930d-123210dq",
        timestamp: "123456789"
    };
    const queryParams = {
        name: ["zhans"],
        age: ["36"],
        tags: ["tag0", "tag1"]
    };

    test("test sign queryParams", () => {
        expect(getCanonicalizedQueryString(queryParams)).toEqual("age=36&name=zhans&tags=tag0&tags=tag1");
        const text = genSignatureText({
            method: "GET",
            queryParams,
            ...baseRequest
        });
        expect(text).toEqual("method=GET&requestPath=/api/v1/example/users&nonce=jlj3rn2930d-123210dq&timestamp=123456789&queryStringMd5=7e7a72e5a7da742a9586a70c06b98322");
    });

    test("test sign requestBody", () => {
        const text = genSignatureText({
            ...baseRequest,
            method: "POST",
            requestBody:"{}",

        });
        expect(text).toEqual("method=POST&requestPath=/api/v1/example/users&nonce=jlj3rn2930d-123210dq&timestamp=123456789&requestBodyMd5=99914b932bd37a50b983c5e7c90ae93b");
    });

    test("test sign queryParam and requestBody", () => {
        const text = genSignatureText({
            ...baseRequest,
            method: "POST",
            requestBody:"{}",
            queryParams
        });
        expect(text).toEqual("method=POST&requestPath=/api/v1/example/users&nonce=jlj3rn2930d-123210dq&timestamp=123456789&queryStringMd5=7e7a72e5a7da742a9586a70c06b98322&requestBodyMd5=99914b932bd37a50b983c5e7c90ae93b");
    });

});
