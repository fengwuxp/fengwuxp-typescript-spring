import * as log4js from "log4js";
import {
    firstUpperCaseToLeftIncline,
    repeatTheFirstWord,
    toHumpResolver,
    toLineResolver, tryConverterMethodNameCommandResolver
} from '../src/SimpleMethodNameCommandResolver';


const logger = log4js.getLogger();
logger.level = 'debug';


describe("test method resolver", () => {


    test("test method resolver 1", () => {
        logger.debug("firstUpperCaseToLeftIncline(\"memberIndexView\")", firstUpperCaseToLeftIncline("memberIndexView"));
        logger.debug("firstUpperCaseToLeftIncline(\"goodsListView\")", firstUpperCaseToLeftIncline("goodsListView"));
        logger.debug("repeatTheFirstWord(\"memberIndexView\")", repeatTheFirstWord("memberIndexView"));
        logger.debug("repeatTheFirstWord(\"goodsListView\")", repeatTheFirstWord("goodsListView"));
        logger.debug("toHumpResolver", toHumpResolver(toLineResolver("goods_listCreate")));

    });

    test("test tryConverterMethodNameCommandResolver", () => {
        logger.debug("tourismCountryCreate", tryConverterMethodNameCommandResolver("tourismCountryCreate",["to","push"], "push"));
        logger.debug("toTourismCountryCreate", tryConverterMethodNameCommandResolver("toTourismCountryCreate", ["to","push"],"to"));
        logger.debug("pushTourismCountryCreate", tryConverterMethodNameCommandResolver("pushTourismCountryCreate", ["to","push"],"push"));
        logger.debug("popAndPushTourismCountryCreate", tryConverterMethodNameCommandResolver("popAndPushTourismCountryCreate", ["to","push","popAndPush"],"push"));


    });


    test("test tryConverterMethodNameCommandResolver 3", () => {
        logger.debug("get set test", tryConverterMethodNameCommandResolver("setTestAbc",["set","get","remove"], "get"));

    });
});
