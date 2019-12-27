import * as log4js from "log4js";
import SpelExpressionParser from "../src/standard/SpelExpressionParser";


const logger = log4js.getLogger();
logger.level = 'debug';

describe("test spel", () => {

    const spelExpressionParser = new SpelExpressionParser();

    test("constant expression", () => {


        logger.debug("value 1 ", spelExpressionParser.parseRaw("12").getValue());
        logger.debug("value 2", spelExpressionParser.parseRaw("1+2+3+5").getValue());
        logger.debug("value 3", spelExpressionParser.parseRaw("1+2-9").getValue());
        logger.debug("value 4", spelExpressionParser.parseRaw("'a'.startsWith('a')").getValue());

    });

    test("function node expression 1", () => {

        const context = {
            a: {
                c: {
                    d: 3
                }
            },
            c: {
                b: 2
            },
            k: 6
        };

        const spelExpression = spelExpressionParser.parseExpression("${a['c']['d']}+${c.b}> ${k}");
        const value = spelExpression.getValue(context);
        logger.debug("value", value);

    });

    test("function node expression 2", () => {

        const context = {
            a: {
                c: {
                    d: 3
                }
            },
            c: {
                b: 2
            },
            k: 6
        };

        const spelExpression = spelExpressionParser.parseExpression("'我的 '+${a.c.d}");
        const value = spelExpression.getValue(context);
        logger.debug("value", value);

    })

});
