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

        const spelExpression = spelExpressionParser.parseExpression("#a['c']['d']+#c.b> #k");
        const value = spelExpression.getValue(context);
        logger.debug("value", value);
        const spelExpression2 = spelExpressionParser.parseExpression("#a!=null ");
        const value2 = spelExpression2.getValue(context);
        logger.debug("value", value2);

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

        const spelExpression = spelExpressionParser.parseExpression("'我的 '+#a.c.d");
        const value = spelExpression.getValue(context);
        logger.debug("value", value);

    })

    test("function node expression 3", () => {

        const context = {
            values: [1, 3, 4, 6, 6]
        };

        const spelExpression = spelExpressionParser.parseExpression("#values!=null");
        const value = spelExpression.getValue(context);
        logger.debug("value 1", value);

        const spelExpression2 = spelExpressionParser.parseExpression("#values[0]+1+#values[2]+'23'");
        const value2 = spelExpression2.getValue(context);
        logger.debug("value2", value2);

        const spelExpression3 = spelExpressionParser.parseExpression("#values.length");
        const value3 = spelExpression3.getValue(context);
        logger.debug("value 3", value3);
    });

    test("function node expression 4", () => {


        const context = {
            hasRole: function (text) {
                logger.debug("hasRole", text);
                return text == 'ADMIN';
            }
        };
        const spelExpression = spelExpressionParser.parseExpression("#hasRole('text')");
        const value = spelExpression.getValue<boolean>(context);
        logger.debug("value 1", value);
    });

    test("function node expression 5", () => {


        const context = {
            hasRole: function (text) {
                logger.debug("hasRole", text);
                return text == 'ADMIN';
            }
        };
        var begin = new Date().getTime();
        const spelExpression = spelExpressionParser.parseExpression("#hasRole('ADMIN') && #hasRole('ADMIN')");
        const value = spelExpression.getValue<boolean>(context);
        logger.debug("花费的时间", new Date().getTime() - begin);
        logger.debug("value 1", value);
    });


    test("function node expression 6", () => {

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

        const spelExpression = spelExpressionParser.parseExpression("'我的 ' + #a.c.d  + #a.k");
        const value = spelExpression.getValue(context);
        logger.debug("value", value);

    })
});
