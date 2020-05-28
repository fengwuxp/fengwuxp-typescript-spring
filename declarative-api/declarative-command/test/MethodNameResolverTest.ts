import * as log4js from "log4js";
import {
    firstUpperCaseToLeftIncline,
    repeatTheFirstWord,
    toHumpResolver,
    toLineResolver
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


});
