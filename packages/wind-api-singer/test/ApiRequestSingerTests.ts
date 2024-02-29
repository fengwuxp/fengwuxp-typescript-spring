import * as log4js from "log4js";
import {ApiSignatureRequest, getCanonicalizedQueryString, getSignTextForDigest} from "../src/ApiSignatureRequest";
import {HMAC_SHA256, SHA256_WITH_RSA} from "../src/ApiSignatureAlgorithm";


const logger = log4js.getLogger();
logger.level = 'debug';

describe("test api sign", () => {

    const baseRequest = {
        requestPath: "/api/v1/example/users",
        nonce: "jlj3rn2930d-123210dq",
        timestamp: "123456789"
    };
    const queryParams = {
        name: "zhans",
        age: 36,
        tags: ["tag0", "tag1"],
        t2: [undefined]
    };

    test("test sign queryParams", () => {
        expect(getCanonicalizedQueryString(queryParams)).toEqual("age=36&name=zhans&tags=tag0&tags=tag1");
        const text = getSignTextForDigest({
            method: "GET",
            queryParams,
            ...baseRequest
        });
        expect(text).toEqual("method=GET&requestPath=/api/v1/example/users&nonce=jlj3rn2930d-123210dq&timestamp=123456789&queryStringMd5=7e7a72e5a7da742a9586a70c06b98322");
    });

    test("test sign requestBody", () => {
        const text = getSignTextForDigest({
            ...baseRequest,
            method: "POST",
            requestBody: "{}"
        });
        expect(text).toEqual("method=POST&requestPath=/api/v1/example/users&nonce=jlj3rn2930d-123210dq&timestamp=123456789&requestBodyMd5=99914b932bd37a50b983c5e7c90ae93b");
    });

    test("test sign queryParam and requestBody", () => {
        const text = getSignTextForDigest({
            ...baseRequest,
            method: "POST",
            requestBody: "{}",
            queryParams
        });
        expect(text).toEqual("method=POST&requestPath=/api/v1/example/users&nonce=jlj3rn2930d-123210dq&timestamp=123456789&queryStringMd5=7e7a72e5a7da742a9586a70c06b98322&requestBodyMd5=99914b932bd37a50b983c5e7c90ae93b");
    });

    const signatureRequest: ApiSignatureRequest = {
        requestPath: "/ap/v1/users",
        nonce: "j12j34124i1j5219902103120",
        timestamp: "17182381131",
        method: "POST",
        requestBody: "{id:\"1\"}"
    };

    test("api sign with hmac256", () => {
        const secretKey = "0241nl401kmdsai21o312..";
        const sign = HMAC_SHA256.sign(signatureRequest, secretKey);
        const signByJava: string = "2AmHWvN3od0AA0HpETFCp8cbYeB/JSg5pOB6h8Pliqk=";
        expect(HMAC_SHA256.verify(signatureRequest, secretKey, sign)).toEqual(true);
        expect(HMAC_SHA256.verify(signatureRequest, secretKey, signByJava)).toEqual(true);
    })

    test("api sign with SHA256withRSA", () => {
        const privateKey = "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUhEy9LRO073/qWNy/OZCFEC91zElSzGXy+U3BFfdfGBADtjX18shDIqziSpFaWa/S5BQ4fY30t4GNopzvgZR6y0JSGoy00VEubEvbcNJY5gHfCui+C9mVHk1ZGdR6odnP3BZ6ElzAtQQmiJHXw4wjorGPkueWPiamyG1saDUwBKFZq6KipCRv+jAiEE+n7lRm0m3vVGcZkOPhqKnTA3Iu/6VFaUK2LRSwdzTB2V0sj/vd6rwdbFfp1oN+vEIyiLzV3Lv+iRex5y+2wCcmuqxLC07EqVlbMbH8/IPFkl8FLezXH9q2NVI+3V9xwAIzPoL9Mpjs4/4Rp+UQNtl1SkglAgMBAAECggEAWcBeIG8PKZUUcsaAxAntrSS+xoM2XE+SpuD/I5LBXFnvOYIUnACi7yeP2Coh5QSHqwtENu9fqoBtqIGKweP57zo0kjRARIU6Qd7e0ph9XaoWFDqpPMoIZF/dzsmH4RrFwHF01K04mvJYBGYdIgCmCM7HKpmiUOOCs2FmRShlfhdQsdpOGFylqUxkFbCaXvgLAiuhtJWoWgmbNNBegpdYgwUcoeLklv4UsKjRZQ5X8hfw5XSWssazNylFQeo2rUDDFKjeJqP70XThqJN4oMOOuIMhxn5ywF0AIv6VWnxZmJajdFgMLHzrin5t0v498m6NTYkRGAc0JDKXuEMAnMzTAQKBgQD/Yr50G3j81Ch8oiOqRiTu4gvieyC6A+rb+LTN8HKRge9QMDIy0vSjn1ByH8oTQ8D2Bg5QrTMnj7Io/yCIUw+LPI+IdxLOkXvjAUEXZKQwCaT9UHKtBa+DFMKRGqHsW/V5SyZ1rLvGbOCULXVlYeuAGdTMAKBbhCyUDscFZFZvoQKBgQDVByisWSf0S2MtvJfLB8A9cvSk3mhG66OT3YZDCr7ycxyU3/Gmx8yw727sFtfD/r+3KAm9TMR2uLOaAtwToeD3iZ2IVKCIJ/EIeSTaHEjXyP6huOCzCpxRIRo4STb2lVBjUIZZGb5JP/FI+BPGRDan1oZq0MXTUfJpAjm/1KvaBQKBgHcnKfbgDn3fupgTyhIasgamfqcHjYhcZYqGKk1fXwTWm8JNCk6+MBfbL9xfSpfcZ74hqzIm7RQLLjOEfTg9kKYE9m7UJ3krVaLfJfB1K0miZlEt5KMnYPEGkZTD2UJ+0TPrRSFoGyAEEm/wGbLYkdjttGQN8sNgErBtiJvSaaWhAoGAGUQhGdf1Oi9a0wjkRAtmTKN+yrMqUQcPvrDuhLMYlK78e9fX1H0sFOxBDrVi3/cuC+4uwYoCX0Zm3uRp79YqVZG34nyPEbcTCns72La0GQvYz5ua4wFmKuUvM+/TGgn5n93kIVtBS3TPDGWICuL6TIvQI4khfX/hrXy7FrqFq3UCgYBO1YwEytxEhwkZviFuGI3dWwqZ6xugNMSEkRL+ocF61keDlOUeayECkOOfX7uFCkGEHf8s84qvnAMwlbyy1nXQddM7qHmbKhc1BBRG9B8Vg7/L5P7j1ywSpyHjN9soz1Uwc85nqs0udEfPCxyO6/kqNz2i8aLKg0CPW9NU2xFnXA==";
        const publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1IRMvS0TtO9/6ljcvzmQhRAvdcxJUsxl8vlNwRX3XxgQA7Y19fLIQyKs4kqRWlmv0uQUOH2N9LeBjaKc74GUestCUhqMtNFRLmxL23DSWOYB3wrovgvZlR5NWRnUeqHZz9wWehJcwLUEJoiR18OMI6Kxj5Lnlj4mpshtbGg1MAShWauioqQkb/owIhBPp+5UZtJt71RnGZDj4aip0wNyLv+lRWlCti0UsHc0wdldLI/73eq8HWxX6daDfrxCMoi81dy7/okXsecvtsAnJrqsSwtOxKlZWzGx/PyDxZJfBS3s1x/atjVSPt1fccACMz6C/TKY7OP+EaflEDbZdUpIJQIDAQAB";
        const sign = SHA256_WITH_RSA.sign(signatureRequest, privateKey);
        const signByJava: string = "myqx+8nASV+gZXSJPenAS/6WFUVrKsiEeEiWUvmtHm/zOX15eTq9EBhy9Rz76hW52IYFnrJwZXYX740K6nB7e9JwkciN4v2DbLC9fiYbkYny5OcmO68IW3TAS+uu43ShwXjzZqRp6b6gID4hbZ+b9E8cZ7qXnfyh7Pr+y9aJaF61dWbxmg5/+sJQH4gxegYxDkptu2H0VZqQkQeNm95NJ4P5jYEEB6NqfqFj0pyXa1mZlw5S4xxg6bP+XbUd1tWm2HcLRfSuCo0WH9invr4Dogkcr5AFAmK6UK5M6SogMffaaNMroa5Tf00Opp/zQyIuzCm7F4W5U/3QxiJo0nIc8Q==\n"
        expect(SHA256_WITH_RSA.verify(signatureRequest, publicKey, sign)).toEqual(true);
        expect(SHA256_WITH_RSA.verify(signatureRequest, publicKey, signByJava)).toEqual(true);
    })

});
