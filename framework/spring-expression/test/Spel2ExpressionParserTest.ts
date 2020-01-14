import * as log4js from "log4js";
import {StandardContext, SpelExpressionEvaluator} from 'spel2js';


const logger = log4js.getLogger();
logger.level = 'debug';

describe("test spel", () => {


    test("constant expression", () => {


        //given
        let context = {
                myString: 'global context'
            },
            locals = {
                myString: 'hello world!'
            };

        //when
        let local = SpelExpressionEvaluator.eval('#myString == "hello world!"', context, locals);

        //then
        expect(local).toBe(true);

        logger.debug("local", local);
    });


});
