import * as log4js from "log4js";
import {StandardContext, SpelExpressionEvaluator} from 'spel2js';


const logger = log4js.getLogger();
logger.level = 'debug';

describe("test spel", () => {


    test("constant expression", () => {


        //given
        let context = {
                myString: 'global context',
                val: 1
            },
            locals = {
                myString: 'hello world!',
                val: 4
            };

        var begin = new Date().getTime();
        //when
        // let local = SpelExpressionEvaluator.eval('#myString == "hello world!" && #val>1', context, locals);
        let local = SpelExpressionEvaluator.eval('#myString+"hello world!"+ #val', context, locals);
        logger.debug(new Date().getTime() - begin);
        //then
        // expect(local).toBe(true);

        logger.debug("local", local);
    });


});
