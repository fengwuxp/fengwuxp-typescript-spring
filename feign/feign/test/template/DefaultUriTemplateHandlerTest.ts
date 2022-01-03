import * as log4js from "log4js";
import {
    defaultUriTemplateFunctionHandler,
    DefaultUriTemplateHandler,
    converterFunctionInterface,
    UriTemplateHandler,
    UriTemplateHandlerInterface
} from "../../src";


const logger = log4js.getLogger();
logger.level = 'debug';

describe("template test", () => {

    const defaultUriTemplateHandler: UriTemplateHandler = new DefaultUriTemplateHandler();

    test("path variable", () => {

        const expand1 = defaultUriTemplateFunctionHandler("http://a.b.com/{module}/{id}", ["member", 1]);
        const expand2 = defaultUriTemplateFunctionHandler("http://a.b.com/{module}/{id}?name=李四", {
            "module": "member",
            id: 1
        });
        const expand3 = defaultUriTemplateFunctionHandler("http://a.b.com/member/{id}", [1, "member"]);
        logger.debug("path variable ", expand1, expand2, expand3);
    });


    test("query string", () => {

        const expand1 = defaultUriTemplateHandler.expand("http://a.b.com/member", {"id": 1});
        const expand2 = defaultUriTemplateHandler.expand("http://a.b.com/member?name=张三", {"id": 2});
        const expand3 = defaultUriTemplateHandler.expand("http://a.b.com/member?name=张三", {"id": [1, 2, 3]});
        logger.debug("query string ", expand1, expand2, expand3);
    });


    test("path variable and query string", () => {

        const expand1 = defaultUriTemplateHandler.expand("http://a.b.com/member/{id}?age=12&sex=MAN", {
            "id": 1,
            name: "张三"
        });
        const expand2 = defaultUriTemplateHandler.expand("http://a.b.com/member/{id}", {"id": 2, name: "张三"});
        const expand3 = defaultUriTemplateHandler.expand("http://a.b.com/member?name=张三", {"id": [1, 2, 3]});
        logger.debug("path variable and query string ", expand1, expand2, expand3);
    });

    test("invoke function Interface ", () => {
        const expand1 = converterFunctionInterface<UriTemplateHandler, UriTemplateHandlerInterface>(defaultUriTemplateHandler).expand("http://a.b.com/member/{id}", {
            "id": 2,
            name: "张三"
        });
        const expand2 = converterFunctionInterface<UriTemplateHandler, UriTemplateHandlerInterface>(defaultUriTemplateFunctionHandler).expand("http://a.b.com/member/{id}", {
            "id": 2,
            name: "张三"
        });
        logger.debug("invoke function Interface ", expand1,expand2);
    })


});
